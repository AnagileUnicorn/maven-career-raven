const { Telegraf, Markup } = require('telegraf');
const cron = require('node-cron');

const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);

const backlog = [
  {
    id: 1,
    category: "External Credibility 🌍",
    action: "Write one LinkedIn post this week",
    detail: "One real observation from your AI work. One question at the end. 20 minutes max. You already have the insight — just write it like you'd say it to a colleague.",
    effort: "20 mins",
    win: "You've started building your external voice. That's everything. 🪶"
  },
  {
    id: 2,
    category: "Sponsor Relationship 💛",
    action: "Send your AI Council contact something useful",
    detail: "One article, one observation, one connection to her risk lens. No agenda. Just 'thought of you when I saw this.' Frame it around safe AI adoption.",
    effort: "10 mins",
    win: "You've moved from colleague to trusted resource. Big difference. 🖤"
  },
  {
    id: 3,
    category: "Internal Visibility 🏛️",
    action: "Book one curiosity conversation inside NBS",
    detail: "Pick someone in operations, customer experience, or HR you don't know yet. Ask for 20 mins to understand how they're thinking about AI. Just listen.",
    effort: "20 mins to book, 20 mins to meet",
    win: "You're building the connective tissue. One conversation at a time. 🪶"
  },
  {
    id: 4,
    category: "External Credibility 🌍",
    action: "Reactivate one Banking Transformation Summit connection",
    detail: "Pick one person from May. Bring them something useful — an article, a thought, a connection. No ask. Just warmth and generosity.",
    effort: "15 mins",
    win: "Cold connection just got warm again. You're a natural at this. 🖤"
  },
  {
    id: 5,
    category: "Identity Protection 🛡️",
    action: "Write your Virgin Money case study in three sentences",
    detail: "28 agents. 3,000 users. 35% productivity lift. Put it in your own plain words. You'll use this more than you think — in conversations, on LinkedIn, with recruiters.",
    effort: "15 mins",
    win: "Your evidence is now ready to use without having to remember it under pressure. 🪶"
  },
  {
    id: 6,
    category: "External Credibility 🌍",
    action: "Identify one speaking or writing opportunity",
    detail: "One financial services AI event, one industry publication, one webinar. Just identify it — don't commit yet. Try Finextra, Banking Technology, or a FS AI community panel.",
    effort: "20 mins research",
    win: "You've found your next platform. Maven is proud. 🖤"
  },
  {
    id: 7,
    category: "Recruiter Network 🤝",
    action: "Send a quiet market check message to one recruiter",
    detail: "KDR, Eames Consulting, or Broadreach. Frame it as staying connected to the market. Not looking — just listening. Keep it warm and brief.",
    effort: "10 mins",
    win: "Your safety net just got a little stronger. Smart move. 🪶"
  },
  {
    id: 8,
    category: "Internal Visibility 🏛️",
    action: "Document one thing you've learned from the Copilot rollout",
    detail: "One honest observation. One pattern you've noticed across teams. Write it up in half a page. Share it with your manager or AI Council contact informally.",
    effort: "30 mins",
    win: "Your insights are now on paper inside NBS. That's your name on something real. 🖤"
  },
  {
    id: 9,
    category: "Peer Network 🌐",
    action: "Identify three external peers doing similar work",
    detail: "Look at Banking Transformation Summit speakers, LinkedIn connections who engage thoughtfully with AI posts, FS AI community members. Just name them — don't reach out yet.",
    effort: "20 mins",
    win: "Your external peer community is starting to take shape. 🪶"
  },
  {
    id: 10,
    category: "External Credibility 🌍",
    action: "Write your second LinkedIn post",
    detail: "Build on the first. This time share something that didn't go as planned and what you learned. Practitioners trust people who share failure as well as success.",
    effort: "20 mins",
    win: "You're consistent now. That's what builds a voice. 🖤"
  }
];

const userState = {};

function getState(chatId) {
  if (!userState[chatId]) {
    userState[chatId] = {
      currentTask: 0,
      completedTasks: [],
      chatId: chatId,
      nudgeEnabled: false,
      awaitingWin: false
    };
  }
  return userState[chatId];
}

const moodResponses = {
  great: [
    "🪶 Love that energy! Ride it. Even 10 minutes on your current task today counts.",
    "🖤 That's the Maven spirit. What small thing can we tick off while you're flying high?",
    "🪶 Brilliant. Use that feeling. Type /task — your next step is waiting."
  ],
  okay: [
    "🪶 Okay is perfectly fine. Okay is enough. Want to do just one tiny thing today?",
    "🖤 Okay is honest and honest is good. No pressure. Type /task if you want a gentle nudge.",
    "🪶 Okay days are valid days. Even ravens rest. I'm here either way."
  ],
  struggling: [
    "🖤 Thank you for telling me. That takes courage. Today we do nothing career-related. Rest. I'll be here tomorrow.",
    "🪶 Struggling is real and it matters. Put the backlog down. Come back when you're ready.",
    "🖤 Some days are hard. That's not failure — that's being human. Rest now. Maven holds the plan."
  ]
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function moodKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✨ Great', 'mood_great'),
      Markup.button.callback('😐 Okay', 'mood_okay'),
      Markup.button.callback('💙 Struggling', 'mood_struggling')
    ]
  ]);
}

// /start
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  getState(chatId);
  ctx.reply(
    `🪶 *Caw caw! Maven here.*\n\nI'm your Career Raven — I see the big picture so you don't have to hold it all in your head at once.\n\nI'll nudge you gently, celebrate your wins, and only ever ask you to do *one small thing at a time.*\n\nNo overwhelm. Just the next right thing. 🖤`,
    { parse_mode: 'Markdown' }
  );
  setTimeout(() => {
    ctx.reply(`🪶 Before we begin — how are you feeling today?\n\nBe honest. I can handle it.`, moodKeyboard());
  }, 1500);
});

// /help
bot.help((ctx) => {
  ctx.reply(
    `🪶 *What Maven can do:*\n\n` +
    `/task — your current action\n` +
    `/done — mark it complete, get the next one\n` +
    `/backlog — see everything ahead\n` +
    `/checkin — tell me how you're feeling\n` +
    `/nudge — toggle daily gentle nudges\n` +
    `/win — log something you're proud of\n` +
    `/rest — tell Maven you need a break\n\n` +
    `🖤 One thing at a time. Always.`,
    { parse_mode: 'Markdown' }
  );
});

// /task
bot.command('task', (ctx) => {
  const state = getState(ctx.chat.id);
  const task = backlog[state.currentTask];
  if (!task) {
    ctx.reply(`🪶 You've completed the whole backlog! That's extraordinary. Type /win to celebrate.`);
    return;
  }
  ctx.reply(
    `🪶 *Your current task:*\n\n*${task.category}*\n\n✅ *${task.action}*\n\n${task.detail}\n\n⏱️ _Effort: ${task.effort}_\n\nWhen you're done, type /done and I'll celebrate with you. 🖤`,
    { parse_mode: 'Markdown' }
  );
});

// /done
bot.command('done', (ctx) => {
  const chatId = ctx.chat.id;
  const state = getState(chatId);
  const task = backlog[state.currentTask];
  if (!task) {
    ctx.reply(`🪶 Nothing to complete yet — type /task to see what's next.`);
    return;
  }
  state.completedTasks.push(task.id);
  state.currentTask++;
  ctx.reply(
    `🪶🖤 *YES! You did it!*\n\n_${task.win}_\n\nThat's ${state.completedTasks.length} thing${state.completedTasks.length > 1 ? 's' : ''} done. Maven is watching and Maven is impressed. 🪶`,
    { parse_mode: 'Markdown' }
  );
  const next = backlog[state.currentTask];
  if (next) {
    setTimeout(() => {
      ctx.reply(`🖤 Ready for the next one when you are. Type /task whenever. No rush.`);
    }, 2000);
  }
});

// /backlog
bot.command('backlog', (ctx) => {
  const state = getState(ctx.chat.id);
  let msg = `🪶 *The full plan — one at a time:*\n\n`;
  backlog.forEach((item, index) => {
    const done = state.completedTasks.includes(item.id);
    const current = index === state.currentTask;
    const prefix = done ? '✅' : current ? '👉' : '⬜';
    msg += `${prefix} ${item.action}\n`;
  });
  msg += `\n🖤 _${state.completedTasks.length} of ${backlog.length} done. Focus on the 👉 one._`;
  ctx.reply(msg, { parse_mode: 'Markdown' });
});

// /checkin
bot.command('checkin', (ctx) => {
  ctx.reply(`🪶 How are you doing right now? Be honest — I mean it.`, moodKeyboard());
});

// /win
bot.command('win', (ctx) => {
  const state = getState(ctx.chat.id);
  state.awaitingWin = true;
  ctx.reply(`🪶 Tell me your win. Big or small — Maven doesn't judge size. What happened?`);
});

// /rest
bot.command('rest', (ctx) => {
  ctx.reply(`🪶 Rest acknowledged. The backlog isn't going anywhere.\n\nYou are more than your productivity. Come back when you're ready. I'll be here. 🖤`);
});

// /nudge
bot.command('nudge', (ctx) => {
  const state = getState(ctx.chat.id);
  state.nudgeEnabled = !state.nudgeEnabled;
  if (state.nudgeEnabled) {
    ctx.reply(`🪶 Daily nudges ON. I'll check in each morning.\n\nJust a gentle caw. Nothing demanding. 🖤`);
  } else {
    ctx.reply(`🪶 Daily nudges OFF. I'll be quiet until you need me. Type /checkin or /task whenever you're ready.`);
  }
});

// Handle mood button presses
bot.action('mood_great', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(getRandom(moodResponses.great));
  setTimeout(() => {
    ctx.reply(`🪶 Want to see your current task while you've got the energy?`,
      Markup.inlineKeyboard([[Markup.button.callback('Yes, show me 👉', 'show_task')]])
    );
  }, 1000);
});

bot.action('mood_okay', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(getRandom(moodResponses.okay));
});

bot.action('mood_struggling', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(getRandom(moodResponses.struggling));
});

bot.action('show_task', (ctx) => {
  ctx.answerCbQuery();
  const state = getState(ctx.chat.id);
  const task = backlog[state.currentTask];
  if (task) {
    ctx.reply(
      `🪶 *${task.category}*\n\n✅ *${task.action}*\n\n${task.detail}\n\n⏱️ _${task.effort}_`,
      { parse_mode: 'Markdown' }
    );
  }
});

// Handle free text (wins)
bot.on('text', (ctx) => {
  const state = getState(ctx.chat.id);
  if (state.awaitingWin) {
    state.awaitingWin = false;
    ctx.reply(
      `🪶🖤 *That counts. That absolutely counts.*\n\n_"${ctx.message.text}"_\n\nMaven is filing this under: things Dawn did when life was hard and she did it anyway. 🖤`,
      { parse_mode: 'Markdown' }
    );
  }
});

// Daily nudge - 9am every day
cron.schedule('0 9 * * *', () => {
  const nudges = [
    `🪶 Morning. One small thing today. That's all. Type /task when you're ready.`,
    `🖤 Good morning. Maven is watching (in a nice way). How are you feeling? /checkin`,
    `🪶 New day. Same you. Brilliant you. Type /task for your next small step.`,
    `🖤 Caw caw. Maven checking in. No pressure — just a gentle wing tap. /checkin`,
    `🪶 Morning! You're further along than you think. Type /backlog to see your progress.`
  ];
  Object.values(userState).forEach(state => {
    if (state.nudgeEnabled && state.chatId) {
      bot.telegram.sendMessage(state.chatId, getRandom(nudges));
    }
  });
});

bot.launch();
console.log('🪶 Maven the Career Raven is live and watching...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
