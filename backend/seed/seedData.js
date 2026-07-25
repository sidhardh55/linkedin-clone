export const SEED_PASSWORD = "Password123!";
export const SEED_EMAIL_DOMAIN = "@demo.linkedinclone.dev";

export const users = [
  {
    name: "Sarah Chen",
    username: "sarahchen",
    email: `sarah.chen${SEED_EMAIL_DOMAIN}`,
    avatarImg: 5,
    profile: {
      bio: "Senior Software Engineer passionate about distributed systems, developer experience, and building products that scale. Open-source contributor and conference speaker.",
      currentPost: "Senior Software Engineer at Stripe",
      pastWork: [
        { company: "Airbnb", position: "Software Engineer II", years: "2019 – 2022" },
        { company: "Dropbox", position: "Software Engineer Intern", years: "2018 – 2019" },
      ],
      education: [
        { school: "Stanford University", degree: "M.S. Computer Science", fieldOfStudy: "Distributed Systems" },
        { school: "UC Berkeley", degree: "B.S. Electrical Engineering & CS", fieldOfStudy: "2014 – 2018" },
      ],
    },
  },
  {
    name: "Marcus Johnson",
    username: "marcusjohnson",
    email: `marcus.johnson${SEED_EMAIL_DOMAIN}`,
    avatarImg: 12,
    profile: {
      bio: "Product Manager with 8+ years turning user insights into shipped features. Previously at Google and Spotify. Believer in data-informed decisions and ruthless prioritization.",
      currentPost: "Senior Product Manager at Google",
      pastWork: [
        { company: "Spotify", position: "Product Manager", years: "2018 – 2021" },
        { company: "Microsoft", position: "Associate PM", years: "2016 – 2018" },
      ],
      education: [
        { school: "Harvard Business School", degree: "MBA", fieldOfStudy: "Technology & Operations" },
        { school: "Georgia Tech", degree: "B.S. Industrial Engineering", fieldOfStudy: "2012 – 2016" },
      ],
    },
  },
  {
    name: "Priya Sharma",
    username: "priyasharma",
    email: `priya.sharma${SEED_EMAIL_DOMAIN}`,
    avatarImg: 9,
    profile: {
      bio: "Data Scientist specializing in recommendation systems and NLP. I help teams turn messy data into decisions. Kaggle Expert · PyTorch enthusiast.",
      currentPost: "Lead Data Scientist at Netflix",
      pastWork: [
        { company: "Uber", position: "Data Scientist", years: "2019 – 2022" },
        { company: "IBM Research", position: "Research Intern", years: "2018" },
      ],
      education: [
        { school: "Carnegie Mellon University", degree: "M.S. Machine Learning", fieldOfStudy: "2017 – 2019" },
        { school: "IIT Delhi", degree: "B.Tech Computer Science", fieldOfStudy: "2013 – 2017" },
      ],
    },
  },
  {
    name: "James O'Brien",
    username: "jamesobrien",
    email: `james.obrien${SEED_EMAIL_DOMAIN}`,
    avatarImg: 15,
    profile: {
      bio: "UX Designer crafting intuitive interfaces for complex workflows. Design systems advocate. Previously at Apple and Adobe. Always sketching on paper first.",
      currentPost: "Senior UX Designer at Figma",
      pastWork: [
        { company: "Adobe", position: "Product Designer", years: "2019 – 2022" },
        { company: "Apple", position: "UI/UX Intern", years: "2018" },
      ],
      education: [
        { school: "Rhode Island School of Design", degree: "BFA Graphic Design", fieldOfStudy: "2014 – 2018" },
      ],
    },
  },
  {
    name: "Elena Rodriguez",
    username: "elenarodriguez",
    email: `elena.rodriguez${SEED_EMAIL_DOMAIN}`,
    avatarImg: 20,
    profile: {
      bio: "Marketing leader driving B2B growth through content, demand gen, and brand storytelling. 2x startup exit. Mentor at Techstars.",
      currentPost: "Director of Marketing at HubSpot",
      pastWork: [
        { company: "Mailchimp", position: "Head of Content Marketing", years: "2017 – 2021" },
        { company: "Canva", position: "Growth Marketing Manager", years: "2015 – 2017" },
      ],
      education: [
        { school: "Northwestern University", degree: "B.A. Communications", fieldOfStudy: "2011 – 2015" },
      ],
    },
  },
  {
    name: "David Kim",
    username: "davidkim",
    email: `david.kim${SEED_EMAIL_DOMAIN}`,
    avatarImg: 33,
    profile: {
      bio: "DevOps / Platform Engineer. Kubernetes, Terraform, and observability by day. Home lab enthusiast by night. AWS Community Builder.",
      currentPost: "Staff DevOps Engineer at Amazon Web Services",
      pastWork: [
        { company: "Datadog", position: "Site Reliability Engineer", years: "2018 – 2022" },
        { company: "DigitalOcean", position: "DevOps Engineer", years: "2016 – 2018" },
      ],
      education: [
        { school: "University of Washington", degree: "B.S. Computer Engineering", fieldOfStudy: "2012 – 2016" },
      ],
    },
  },
  {
    name: "Amara Okonkwo",
    username: "amaraokonkwo",
    email: `amara.okonkwo${SEED_EMAIL_DOMAIN}`,
    avatarImg: 25,
    profile: {
      bio: "Founder & CEO building tools for remote teams. Previously PM at Slack. Y Combinator W21. Passionate about inclusive hiring and async-first culture.",
      currentPost: "Founder & CEO at FlowSpace (YC W21)",
      pastWork: [
        { company: "Slack", position: "Product Manager", years: "2017 – 2020" },
        { company: "McKinsey & Company", position: "Business Analyst", years: "2014 – 2017" },
      ],
      education: [
        { school: "Wharton School, UPenn", degree: "MBA", fieldOfStudy: "Entrepreneurship" },
        { school: "University of Lagos", degree: "B.Sc Economics", fieldOfStudy: "2010 – 2014" },
      ],
    },
  },
  {
    name: "Michael Torres",
    username: "michaeltorres",
    email: `michael.torres${SEED_EMAIL_DOMAIN}`,
    avatarImg: 51,
    profile: {
      bio: "Full-stack engineer who loves React, Node, and GraphQL. Building social products at scale. Weekend hackathon regular.",
      currentPost: "Software Engineer at Meta",
      pastWork: [
        { company: "Twitter", position: "Frontend Engineer", years: "2019 – 2022" },
        { company: "Shopify", position: "Full Stack Developer", years: "2017 – 2019" },
      ],
      education: [
        { school: "University of Texas at Austin", degree: "B.S. Computer Science", fieldOfStudy: "2013 – 2017" },
      ],
    },
  },
  {
    name: "Lisa Nakamura",
    username: "lisanakamura",
    email: `lisa.nakamura${SEED_EMAIL_DOMAIN}`,
    avatarImg: 44,
    profile: {
      bio: "HR Business Partner helping high-growth tech companies build people-first cultures. DEI champion. Certified coach.",
      currentPost: "Senior HR Business Partner at Salesforce",
      pastWork: [
        { company: "LinkedIn", position: "HR Generalist", years: "2016 – 2020" },
        { company: "Workday", position: "People Operations Coordinator", years: "2014 – 2016" },
      ],
      education: [
        { school: "UCLA Anderson", degree: "M.S. Human Resources", fieldOfStudy: "2012 – 2014" },
      ],
    },
  },
  {
    name: "Ryan Patel",
    username: "ryanpatel",
    email: `ryan.patel${SEED_EMAIL_DOMAIN}`,
    avatarImg: 60,
    profile: {
      bio: "Cybersecurity analyst focused on threat detection and incident response. CISSP certified. I write about security best practices for startups.",
      currentPost: "Senior Security Analyst at CrowdStrike",
      pastWork: [
        { company: "Palo Alto Networks", position: "Security Engineer", years: "2018 – 2021" },
        { company: "Deloitte", position: "Cyber Risk Consultant", years: "2015 – 2018" },
      ],
      education: [
        { school: "NYU Tandon School of Engineering", degree: "M.S. Cybersecurity", fieldOfStudy: "2013 – 2015" },
      ],
    },
  },
];

// authorUsername, body, daysAgo, likes
export const posts = [
  {
    authorUsername: "sarahchen",
    body: "Excited to share that our team at Stripe just shipped a major API refactor — 40% latency reduction on payment intent creation.\n\nBig shoutout to everyone who reviewed PRs at 11pm and helped us get this across the line. This is what great engineering culture looks like.\n\n#engineering #stripe #backend",
    daysAgo: 1,
    likes: 47,
  },
  {
    authorUsername: "marcusjohnson",
    body: "3 lessons I learned transitioning from IC engineer to Product Manager:\n\n1. Say no more often than you say yes\n2. Your job is to maximize outcomes, not output\n3. Write everything down — decisions, rationale, trade-offs\n\nWhat's the best PM advice you've received?",
    daysAgo: 2,
    likes: 89,
  },
  {
    authorUsername: "priyasharma",
    body: "Just published our Q2 recommendation pipeline benchmarks at Netflix.\n\nKey takeaway: hybrid retrieval (collaborative + content-based) still outperforms pure embedding search for cold-start users.\n\nHappy to share the paper link in comments for anyone building rec systems.",
    daysAgo: 3,
    likes: 124,
  },
  {
    authorUsername: "jamesobrien",
    body: "Hot take: the best design reviews happen on paper, not in Figma.\n\nSketching forces you to focus on layout and hierarchy before you get lost in pixels and color tokens.\n\nWho else still starts with pen and paper?",
    daysAgo: 4,
    likes: 56,
  },
  {
    authorUsername: "elenarodriguez",
    body: "We grew HubSpot's newsletter from 50K to 500K subscribers in 18 months.\n\nWhat worked:\n• Consistent weekly cadence\n• Subject lines under 40 characters\n• One clear CTA per email\n• Segmenting by job role\n\nMarketing is a long game. Stay consistent.",
    daysAgo: 5,
    likes: 203,
  },
  {
    authorUsername: "davidkim",
    body: "Deployed our first production workload on EKS Auto Mode this week.\n\nSetup time went from ~2 days to ~2 hours. Still early, but the managed node provisioning is a game changer for small platform teams.\n\nDetailed write-up coming soon on the AWS blog.",
    daysAgo: 6,
    likes: 71,
  },
  {
    authorUsername: "amaraokonkwo",
    body: "FlowSpace just closed our Series A — $12M led by a16z.\n\nWe're building the operating system for async-first remote teams. If you've ever lost context in Slack threads, we're building for you.\n\nHiring across engineering, design, and GTM. DM me!",
    daysAgo: 7,
    likes: 312,
  },
  {
    authorUsername: "michaeltorres",
    body: "Spent the weekend rebuilding my side project with Next.js 15 and Server Components.\n\nInitial impressions:\n✅ Faster TTFB\n✅ Less client JS\n❌ Steeper learning curve for data fetching patterns\n\nWorth it for content-heavy apps.",
    daysAgo: 8,
    likes: 38,
  },
  {
    authorUsername: "lisanakamura",
    body: "Reminder for hiring managers: the best candidates aren't always the ones who interview perfectly.\n\nLook for:\n• Curiosity over credentials\n• How they handle \"I don't know\"\n• Evidence of growth, not just achievement\n\nInclusive hiring starts with better rubrics.",
    daysAgo: 9,
    likes: 167,
  },
  {
    authorUsername: "ryanpatel",
    body: "PSA for startups: enable MFA on every admin account. Today.\n\nWe investigated 3 breach attempts last month where the only thing that stopped attackers was MFA on the AWS root account.\n\nSecurity isn't optional at any stage.",
    daysAgo: 10,
    likes: 95,
  },
  {
    authorUsername: "sarahchen",
    body: "Attended Stripe Sessions last week — incredible energy from the developer community.\n\nMy favorite session was on idempotency keys and exactly-once semantics in payment APIs. Niche? Maybe. Fascinating? Absolutely.",
    daysAgo: 12,
    likes: 29,
  },
  {
    authorUsername: "marcusjohnson",
    body: "Product roadmap tip that changed how our team operates:\n\nInstead of \"Q3 features\", we now plan in \"problems to solve\" with measurable success metrics attached.\n\nStakeholders push back less when the goal is an outcome, not a feature list.",
    daysAgo: 14,
    likes: 64,
  },
  {
    authorUsername: "jamesobrien",
    body: "Before/after of a settings page redesign we shipped at Figma this month.\n\nReduced task completion time by 35% by grouping related actions and removing 4 redundant navigation levels.\n\nSimplicity is hard work.",
    daysAgo: 15,
    likes: 88,
  },
  {
    authorUsername: "priyasharma",
    body: "Grateful to speak at PyData Global this year on building production ML pipelines that don't break on Monday mornings.\n\nSlides and notebook are linked in my profile. Reach out if you want to chat rec systems!",
    daysAgo: 18,
    likes: 52,
  },
  {
    authorUsername: "amaraokonkwo",
    body: "Remote work isn't about working from anywhere — it's about working without friction.\n\nAsync standups, written decision logs, and default-to-document culture saved our startup 10+ hours/week in meetings.\n\nWhat's your async superpower?",
    daysAgo: 20,
    likes: 145,
  },
];

// authorUsername, postAuthorUsername, postBodySnippet, comment
export const comments = [
  {
    authorUsername: "marcusjohnson",
    postAuthorUsername: "sarahchen",
    postBodySnippet: "API refactor",
    body: "Huge congrats Sarah! That latency improvement is no joke. Would love to hear how you approached the migration strategy.",
  },
  {
    authorUsername: "davidkim",
    postAuthorUsername: "sarahchen",
    postBodySnippet: "API refactor",
    body: "40% is impressive. Did you use feature flags for the rollout?",
  },
  {
    authorUsername: "sarahchen",
    postAuthorUsername: "marcusjohnson",
    postBodySnippet: "3 lessons I learned",
    body: "Number 2 hit home for me when I was transitioning too. Outcomes > output every time.",
  },
  {
    authorUsername: "amaraokonkwo",
    postAuthorUsername: "marcusjohnson",
    postBodySnippet: "3 lessons I learned",
    body: "I'd add a 4th: spend more time with customers than with your roadmap spreadsheet.",
  },
  {
    authorUsername: "michaeltorres",
    postAuthorUsername: "priyasharma",
    postBodySnippet: "recommendation pipeline",
    body: "Would love the paper link! We're dealing with cold-start issues on our side project.",
  },
  {
    authorUsername: "priyasharma",
    postAuthorUsername: "priyasharma",
    postBodySnippet: "recommendation pipeline",
    body: "Here's the link — happy to discuss offline if useful: arxiv.org/example (DM me for the real one 😄)",
  },
  {
    authorUsername: "jamesobrien",
    postAuthorUsername: "jamesobrien",
    postBodySnippet: "design reviews happen on paper",
    body: "100%. I keep a Moleskine on my desk specifically for this. Figma comes after the concept is solid.",
  },
  {
    authorUsername: "elenarodriguez",
    postAuthorUsername: "jamesobrien",
    postBodySnippet: "design reviews happen on paper",
    body: "As a non-designer PM, I wish more designers did this before bringing me into review meetings!",
  },
  {
    authorUsername: "lisanakamura",
    postAuthorUsername: "elenarodriguez",
    postBodySnippet: "newsletter from 50K",
    body: "The segmenting by job role tip is underrated. We saw 2x open rates when we stopped sending the same email to everyone.",
  },
  {
    authorUsername: "ryanpatel",
    postAuthorUsername: "davidkim",
    postBodySnippet: "EKS Auto Mode",
    body: "Curious about the security model — does Auto Mode change how you handle pod identity / IRSA?",
  },
  {
    authorUsername: "sarahchen",
    postAuthorUsername: "amaraokonkwo",
    postBodySnippet: "Series A",
    body: "Congratulations Amara! Well deserved — FlowSpace has been on my radar since the YC demo day.",
  },
  {
    authorUsername: "marcusjohnson",
    postAuthorUsername: "amaraokonkwo",
    postBodySnippet: "Series A",
    body: "Amazing news! The async-first space needs more thoughtful tools. Rooting for you.",
  },
  {
    authorUsername: "jamesobrien",
    postAuthorUsername: "michaeltorres",
    postBodySnippet: "Next.js 15",
    body: "Server Components changed how I think about component boundaries. Took me a week to unlearn old patterns though.",
  },
  {
    authorUsername: "amaraokonkwo",
    postAuthorUsername: "lisanakamura",
    postBodySnippet: "best candidates aren't always",
    body: "Shared this with our entire hiring panel. The 'how they handle I don't know' rubric is gold.",
  },
  {
    authorUsername: "davidkim",
    postAuthorUsername: "ryanpatel",
    postBodySnippet: "enable MFA",
    body: "Also recommend hardware keys for admin accounts. Worth the $20 per key.",
  },
  {
    authorUsername: "ryanpatel",
    postAuthorUsername: "ryanpatel",
    postBodySnippet: "enable MFA",
    body: "Agreed — YubiKey for all privileged access. Non-negotiable at CrowdStrike.",
  },
  {
    authorUsername: "priyasharma",
    postAuthorUsername: "sarahchen",
    postBodySnippet: "Stripe Sessions",
    body: "Idempotency keys are one of those concepts that seem simple but are surprisingly deep. Great session!",
  },
  {
    authorUsername: "michaeltorres",
    postAuthorUsername: "jamesobrien",
    postBodySnippet: "settings page redesign",
    body: "35% improvement is massive. Did you run usability tests before and after?",
  },
  {
    authorUsername: "jamesobrien",
    postAuthorUsername: "jamesobrien",
    postBodySnippet: "settings page redesign",
    body: "Yes — 12 moderated sessions pre-launch. The navigation depth issue came up in 9 of them.",
  },
  {
    authorUsername: "elenarodriguez",
    postAuthorUsername: "amaraokonkwo",
    postBodySnippet: "async superpower",
    body: "Written decision logs changed our marketing team. No more 'wait, why did we choose that?' moments.",
  },
];

// fromUsername, toUsername, status: 'accepted' | 'pending' | 'rejected'
export const connections = [
  { fromUsername: "amaraokonkwo", toUsername: "sarahchen", status: "accepted" },
  { fromUsername: "jamesobrien", toUsername: "marcusjohnson", status: "accepted" },
  { fromUsername: "michaeltorres", toUsername: "jamesobrien", status: "accepted" },
  { fromUsername: "ryanpatel", toUsername: "davidkim", status: "accepted" },
  { fromUsername: "sarahchen", toUsername: "marcusjohnson", status: "accepted" },
  { fromUsername: "priyasharma", toUsername: "michaeltorres", status: "accepted" },
  { fromUsername: "elenarodriguez", toUsername: "priyasharma", status: "pending" },
  { fromUsername: "davidkim", toUsername: "sarahchen", status: "pending" },
  { fromUsername: "lisanakamura", toUsername: "amaraokonkwo", status: "pending" },
  { fromUsername: "ryanpatel", toUsername: "sarahchen", status: "pending" },
  { fromUsername: "michaeltorres", toUsername: "elenarodriguez", status: "rejected" },
];

// senderUsername, receiverUsername, message, hoursAgo
export const messages = [
  {
    senderUsername: "sarahchen",
    receiverUsername: "marcusjohnson",
    message: "Hey Marcus! Saw your post about IC to PM transition — really resonated. Would love to pick your brain over coffee sometime.",
    hoursAgo: 48,
  },
  {
    senderUsername: "marcusjohnson",
    receiverUsername: "sarahchen",
    message: "Absolutely Sarah! How about Thursday at 2pm? There's a great café near Google's campus.",
    hoursAgo: 46,
  },
  {
    senderUsername: "sarahchen",
    receiverUsername: "marcusjohnson",
    message: "Thursday works perfectly. Looking forward to it!",
    hoursAgo: 45,
  },
  {
    senderUsername: "jamesobrien",
    receiverUsername: "michaeltorres",
    message: "Michael — your Next.js post was spot on. We're evaluating Server Components for our design system docs site.",
    hoursAgo: 72,
  },
  {
    senderUsername: "michaeltorres",
    receiverUsername: "jamesobrien",
    message: "Happy to share our setup! The trickiest part was figuring out which components actually need 'use client'. I can send you our decision tree doc.",
    hoursAgo: 70,
  },
  {
    senderUsername: "jamesobrien",
    receiverUsername: "michaeltorres",
    message: "That would be amazing, thank you!",
    hoursAgo: 68,
  },
  {
    senderUsername: "amaraokonkwo",
    receiverUsername: "sarahchen",
    message: "Sarah! Thanks for the congrats on our Series A. Would Stripe ever be interested in a FlowSpace pilot for your eng team?",
    hoursAgo: 24,
  },
  {
    senderUsername: "sarahchen",
    receiverUsername: "amaraokonkwo",
    message: "Congrats again! I'll intro you to our internal tools PM — async tooling is definitely on our radar.",
    hoursAgo: 20,
  },
  {
    senderUsername: "davidkim",
    receiverUsername: "ryanpatel",
    message: "Ryan, quick question on your MFA post — do you recommend YubiKey or Google Titan for a 50-person startup?",
    hoursAgo: 12,
  },
  {
    senderUsername: "ryanpatel",
    receiverUsername: "davidkim",
    message: "For 50 people I'd go YubiKey 5 NFC — works with phones and laptops, and CrowdStrike uses them org-wide. Happy to share our rollout playbook.",
    hoursAgo: 10,
  },
];
