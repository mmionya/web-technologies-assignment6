// Every find() below searches the rendered DOM, never the party array.
// filter() receives a DOM element as `this`.
const cases = [
  { title: 'Who is in the hall?', find: () => $('#hall .guest') },
  { title: 'Who wears yellow or purple?', find: () => $('.guest.yellow, .guest.purple') },
  { title: 'Which AITU students are upstairs?', find: () => $('.floor[data-floor="2"]').find('.guest.aitu') },
  { title: 'Who has glasses or a bag?', find: () => $('.guest.has-glasses, .guest.has-bag') },
  { title: 'Who came with nothing?', find: () => $('.guest[data-things=""]') },
  { title: 'Who has a phone but no bag?', find: () => $('.guest.has-phone').not('.has-bag') },
  { title: 'Who arrived from 20:30 to 21:00?', find: () => $('.guest').filter(function () { return $(this).attr('data-time') >= '20:30' && $(this).attr('data-time') <= '21:00'; }) },
  { title: 'Who arrived after 21:00 and is not an AITU student?', find: () => $('.guest').not('.aitu').filter(function () { return $(this).attr('data-time') > '21:00'; }) },
  { title: 'Who stands next to Askar?', find: () => $('#Askar').prev('.guest').add($('#Askar').next('.guest')) },
  { title: 'Who stands last in each room?', find: () => $('.guests > .guest:last-child') },
  { title: 'Who stands third in each room?', find: () => $('.guests > .guest:nth-child(3)') },
  { title: 'Who stands after Timur?', find: () => $('#Timur').nextAll('.guest') },
  { title: 'Who stands right before someone in black?', find: () => $('.guest.black').prev('.guest') },
  { title: 'In which room is Aruzhan?', find: () => $('#Aruzhan').closest('.room') },
  { title: 'Which rooms have fewer than 6 guests?', find: () => $('.room').filter(function () { return $(this).find('.guest').length < 6; }) },
  { title: 'Which rooms have a cup but no glasses?', find: () => $('.room:has(.has-cup)').not(':has(.has-glasses)') },
  { title: 'Who came first to each room?', find: () => $('.guest').filter(function () { return $(this).siblings('.guest').filter((i, guest) => $(guest).attr('data-time') < $(this).attr('data-time')).length === 0; }) },
  { title: 'Miras joins between Askar and Inkar.', find: () => makeGuest(miras).hide().insertAfter('#Askar').fadeIn(300).animate({ top: -12 }, 140).animate({ top: 0 }, 140) },
  { title: 'Natasha goes home.', find: () => $('#Natasha').animate({ top: -12 }, 140).animate({ top: 0 }, 140).fadeOut(300, function () { $(this).remove(); }) },
  { title: 'Who took the cake?', find: () => $('.floor[data-floor="1"] .guest.has-crumbs').not('.has-cup').filter(function () { return $(this).attr('data-time') > '21:00' && $(this).attr('data-time') < '21:30'; }).filter(function () { return $(this).prev('.aitu').add($(this).next('.aitu')).length > 0; }) }
];
