const task2 = $('body').attr('data-task') === '2';
const assetPath = task2 ? '' : '../';
let party = $.extend(true, [], originalParty);
let openedGuest = null;
let lastGuest = null;

function makeGuest(guest) {
  return $('<button>', {
    id: guest.name,
    class: 'guest ' + guest.color + (guest.aitu ? ' aitu' : '') + guest.things.map(thing => ' has-' + thing).join(''),
    'data-name': guest.name,
    'data-time': guest.time,
    'data-things': guest.things.join(' '),
    'data-aitu': String(guest.aitu),
    'data-color': guest.color,
    'aria-label': guest.name + ', came at ' + guest.time,
    type: 'button'
  }).css('--color', colors[guest.color]).data('guest', guest).append(
    $('<img>', { class: 'avatar', src: assetPath + 'avatars/' + guest.name + '.svg', alt: '' }),
    $('<strong>').text(guest.name),
    $('<small>', { class: 'time' }).text(guest.time),
    $('<span>', { class: 'things' }).text(guest.things.map(thing => icons[thing]).join(' ')),
    $('<small>', { class: 'badge' }).text(guest.aitu ? 'AITU' : '')
  );
}

function renderParty() {
  $('#house').empty();
  [2, 1].forEach(floor => {
    const $floor = $('<section>', { class: 'floor', 'data-floor': floor })
      .append($('<h2>').text('Floor ' + floor));
    const $rooms = $('<div>', { class: 'rooms' }).appendTo($floor);
    party.filter(room => room.floor === floor).forEach(room => {
      const $room = $('<section>', { class: 'room', id: room.id });
      const $heading = $('<div>', { class: 'room-heading' }).append($('<h3>').text(room.name));
      if (task2) $heading.append($('<button>', { class: 'sort', text: 'Sort by time', 'aria-pressed': 'false' }));
      const $guests = $('<div>', { class: 'guests' });
      room.guests.forEach(guest => $guests.append(makeGuest(guest)));
      $rooms.append($room.append($heading, $guests));
    });
    $('#house').append($floor);
  });
}

// Finish existing effects before a new action; there are no growing queues.
function finishEffects() {
  $('.flight').stop(true, true);
  $('.guest, .guests').stop(true, true);
  $('.guest').css({ top: 0, left: 0 });
}

function clearSelection() {
  finishEffects();
  $('.selected').removeClass('selected');
  $('.guest').stop(true, true).fadeTo(task2 ? 300 : 0, 1);
  $('#cases button').removeClass('active');
  $('#result').text('Choose a case or click a guest.');
  $('#chain').text('Choose a case.');
}

function runCase(index) {
  closeDetail(true);
  finishEffects();
  renderParty();
  const item = cases[index];
  const $found = item.find().addClass('selected');
  const $guests = $found.filter('.guest').add($found.filter('.room').find('.guest'));
  if (task2) $('.guest').not($guests).stop(true, true).fadeTo(300, 0.2);
  // Cases 18 and 19 include their jump in their fade chain.
  if (index !== 17 && index !== 18) {
    $guests.animate({ top: -12 }, 140).animate({ top: 0 }, 140);
  }
  const names = $found.map(function () {
    return $(this).hasClass('room') ? $(this).find('h3').text() : $(this).attr('data-name');
  }).get();
  $('#result').text('Case ' + (index + 1) + ' — ' + names.length + ': ' + (names.join(', ') || 'Nobody'));
  $('#chain').text(item.find.toString().replace(/^\(\) => /, ''));
  $('#cases button').removeClass('active').eq(index).addClass('active');
}

function avatarBox($guest) {
  const $avatar = $guest.find('.avatar');
  const offset = $avatar.offset();
  return { left: offset.left - $(window).scrollLeft(), top: offset.top - $(window).scrollTop(), width: $avatar.outerWidth(), height: $avatar.outerHeight() };
}

function closeDetail(immediate = false, next) {
  const $detail = $('#detail');
  // Stop the opening animation before starting the closing animation.
  $detail.stop(true, true);
  if (!openedGuest) { if (next) next(); return; }
  const $guest = openedGuest;
  openedGuest = null;
  const done = function () {
    $('#overlay').attr('hidden', true);
    $detail.empty();
    if (next) next();
    else if ($guest.closest('body').length) $guest.trigger('focus');
  };
  if (immediate || !$guest.closest('body').length) done();
  else $detail.animate({ ...avatarBox($guest), opacity: 0, padding: 0 }, 180, done);
}

function openDetail($guest) {
  // Finishing a previous close runs its callback before we fill the new card.
  $('#detail').stop(true, true);
  if (openedGuest) {
    closeDetail(false, () => openDetail($guest));
    return;
  }
  finishEffects();
  openedGuest = $guest;
  lastGuest = $guest;
  const guest = $guest.data('guest');
  const roomId = $guest.closest('.room').attr('id');
  const things = guest.things.map(thing => thing === 'crumbs' ? 'cake crumbs' : thing === 'glasses' ? 'glasses' : 'a ' + thing);
  const $detail = $('#detail').empty().append(
    $('<button>', { class: 'close', text: '×', 'aria-label': 'Close details' }),
    $('<h2>', { id: 'detail-name' }).text(guest.name),
    $('<p>').text('Came at ' + guest.time + '. Clothing: ' + guest.color + '.'),
    $('<p>').text(guest.aitu ? 'AITU student.' : 'Not an AITU student.'),
    $('<p>').text(things.length ? 'Has ' + things.join(' and ') + '.' : 'Has nothing.'),
    $('<p>').text('Room: ' + party.find(room => room.id === roomId).name + '.'),
    $('<div>', { id: 'move-buttons' })
  );
  party.filter(room => room.id !== roomId).forEach(room => {
    $('#move-buttons').append($('<button>', { class: 'move', 'data-room': room.id }).text('Move to ' + room.name));
  });
  const width = Math.min(380, $(window).width() - 24);
  $('#overlay').removeAttr('hidden');
  $detail.css({ width, height: 'auto', padding: 20 });
  const height = Math.min($detail.outerHeight(), $(window).height() - 24);
  $detail.css({ ...avatarBox($guest), opacity: 0, padding: 0, overflow: 'hidden' }).animate({
    width, height, left: ($(window).width() - width) / 2,
    top: Math.max(12, ($(window).height() - height) / 2), opacity: 1, padding: 20
  }, 220, () => {
    $detail.css('overflow', 'auto');
    $detail.find('.close').trigger('focus');
  });
}

// Remember old coordinates, change the DOM, then slide cards into their new places.
function positions() {
  const result = {};
  $('.guest').each(function () { result[this.id] = $(this).offset(); });
  return result;
}

function slideToPlaces(before, except) {
  $('.guest').each(function () {
    if (this.id === except || !before[this.id]) return;
    const $card = $(this);
    const after = $card.offset();
    $card.css({ left: before[this.id].left - after.left, top: before[this.id].top - after.top })
      .animate({ left: 0, top: 0 }, 450);
  });
}

function moveGuest($guest, roomId) {
  closeDetail(true);
  finishEffects();
  const before = positions();
  const guest = $guest.data('guest');
  const start = $guest.offset();
  const heights = {};
  $('.guests').each(function () { heights[$(this).closest('.room').attr('id')] = $(this).height(); });
  const $flight = $guest.clone().removeAttr('id').removeClass('selected').addClass('flight')
    .css({ left: start.left - $(window).scrollLeft(), top: start.top - $(window).scrollTop(), opacity: 1 }).appendTo('body');
  $guest.css('visibility', 'hidden').appendTo($('#' + roomId + ' .guests'));
  party.forEach(room => { room.guests = room.guests.filter(person => person.name !== guest.name); });
  party.find(room => room.id === roomId).guests.push(guest);
  // After a move, use the array's current order as the unsorted order.
  $('.sort').text('Sort by time').attr('aria-pressed', 'false');
  $('.room').removeData('sorted').removeData('order');
  const end = $guest.offset();
  slideToPlaces(before, guest.name);
  $('.guests').each(function () {
    const $list = $(this);
    const height = $list.height();
    $list.css('height', heights[$list.closest('.room').attr('id')]).animate({ height }, 450, function () { $list.css('height', ''); });
  });
  $flight.animate({ left: end.left - $(window).scrollLeft(), top: end.top - $(window).scrollTop() }, 450, function () {
    $guest.css('visibility', 'visible');
    $flight.remove();
  });
  $('#result').text(guest.name + ' moved to ' + party.find(room => room.id === roomId).name + '.');
  // Previous case highlights no longer describe the modified party.
  $('.selected').removeClass('selected');
  $('.guest').css('opacity', 1);
  $('#cases button').removeClass('active');
  $('#chain').text('Choose a case to search the updated party.');
}

function sortRoom($room) {
  closeDetail(true);
  finishEffects();
  const before = positions();
  const $list = $room.find('.guests');
  const cards = $list.children('.guest').get();
  if (!$room.data('order')) $room.data('order', cards.map(card => card.id));
  const sorted = !$room.data('sorted');
  const order = $room.data('order');
  cards.sort((a, b) => sorted
    ? $(a).attr('data-time').localeCompare($(b).attr('data-time'))
    : order.indexOf(a.id) - order.indexOf(b.id));
  $list.append(cards);
  $room.data('sorted', sorted).find('.sort').text(sorted ? 'Picture order' : 'Sort by time').attr('aria-pressed', String(sorted));
  slideToPlaces(before);
}

cases.forEach((item, index) => {
  $('#cases').append($('<button>', { text: index + 1, title: item.title, 'aria-label': 'Case ' + (index + 1) + ': ' + item.title }).on('click', () => runCase(index)));
});
$('#clear').on('click', clearSelection);
$('#reset').on('click', function () {
  closeDetail(true);
  finishEffects();
  party = $.extend(true, [], originalParty);
  renderParty();
  clearSelection();
});
if (task2) {
  $('#house').on('click', '.guest', function () { openDetail($(this)); });
  $('#house').on('click', '.sort', function () { sortRoom($(this).closest('.room')); });
  $('#detail').on('click', '.close', () => closeDetail());
  $('#detail').on('click', '.move', function () { moveGuest(lastGuest, $(this).attr('data-room')); });
  $(document).on('click', function (event) {
    if (!$(event.target).closest('#detail, .guest').length) closeDetail();
  });
  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') closeDetail();
    // Keep keyboard focus inside the open dialog.
    if (event.key === 'Tab' && !$('#overlay').attr('hidden')) {
      const $buttons = $('#detail button');
      if (event.shiftKey && document.activeElement === $buttons[0]) { event.preventDefault(); $buttons.last().trigger('focus'); }
      else if (!event.shiftKey && document.activeElement === $buttons[$buttons.length - 1]) { event.preventDefault(); $buttons.first().trigger('focus'); }
    }
  });
  $(window).on('resize', () => closeDetail(true));
}
renderParty();
