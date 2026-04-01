import React, { useState, useEffect } from "react";
import {
  Page, Layout, Card, Button, Text, BlockStack, InlineStack,
  Badge, Banner, ProgressBar, TextField, Tabs, Tag, Divider,
  IndexTable, Box, Spinner,
} from "@shopify/polaris";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PLAN = {
  storeName: "Paws & Co.",
  tagline: "Treats your dog actually wants",
  recommendedModel: "dropshipping",
  modelReason: "With a low starting budget, dropshipping lets you sell without holding any inventory upfront. It fits perfectly with your goal of earning extra income on the side while keeping risk close to zero.",
  brandVoice: "casual",
  colorScheme: "#8B5E3C",
  aboutUsText: "I started Paws & Co. after spending way too many Saturday afternoons driving to three different pet stores trying to find treats my rescue dog, Mango, would actually eat. She's picky, she's dramatic, and apparently she has opinions about ingredients. So I started sourcing treats from small-batch makers who use real food — no fillers, no mystery meat. Turns out other dog parents were just as fed up with the generic stuff. Now we ship the good stuff straight to your door. Mango approves of every product. That's our quality standard.",
  refundPolicyText: "We want you and your dog to be happy with every order. If something isn't right, here's what to do: You have 30 days from the delivery date to request a return or exchange. Opened treat bags can be returned if your dog genuinely didn't like them — we get it, dogs have opinions. To start a return, just email us at hello@pawsandco.com with your order number and we'll take care of you. Refunds are processed back to your original payment method within 3–5 business days of us receiving the return.",
  shippingInfoText: "We process all orders within 1–2 business days. Once your order ships, you'll get a tracking number by email. Domestic orders typically arrive in 5–8 business days. We ship to Canada and the UK too — international orders take 10–15 business days. Every package is carefully packed to keep treats fresh and intact. If your order arrives damaged or lost, email us and we'll make it right — no questions asked.",
  productIdeas: [
    { name: "Wild Salmon Jerky Strips", description: "Single-ingredient salmon treats — perfect for dogs with allergies or sensitive stomachs.", sourceHint: "AliExpress → 'pet salmon jerky treats' — filter by 4.5+ stars, verified supplier", priceRange: "$14 – $22", marginNote: "~45% margin at retail pricing" },
    { name: "Calming Hemp Chews", description: "Soft chews with hemp oil and chamomile that help anxious dogs relax during storms or travel.", sourceHint: "Alibaba → 'hemp calming dog chews' — MOQ usually 100 units, request COA certificate", priceRange: "$22 – $38", marginNote: "~50% margin, high repeat purchase rate" },
    { name: "Grain-Free Training Treats", description: "Tiny soft bites in a resealable pouch — ideal for training sessions and positive reinforcement.", sourceHint: "AliExpress → 'grain free training treats small dogs' — look for bulk listings", priceRange: "$12 – $18", marginNote: "~40% margin, fast seller" },
    { name: "Dental Chew Sticks (Monthly Bundle)", description: "Chlorophyll-infused sticks that clean teeth and freshen breath — sold as a 30-day supply.", sourceHint: "Alibaba → 'dental chew sticks dogs chlorophyll' — good margins on bundle pricing", priceRange: "$18 – $28", marginNote: "~55% margin on bundles" },
    { name: "Freeze-Dried Raw Toppers", description: "Crumbled raw meat to sprinkle over kibble — makes any meal irresistible to picky eaters.", sourceHint: "AliExpress → 'freeze dried dog food topper beef chicken' — verify freeze-dry process", priceRange: "$16 – $26", marginNote: "~48% margin, premium positioning" },
  ],
  roadmapItems: [
    { timeframe: "Days 1–3", task: "Finish your store setup", detail: "Add your logo, pick your brand colors (we suggest warm brown #8B5E3C), and make sure your three policy pages look polished." },
    { timeframe: "Week 1", task: "Add all 5 products", detail: "Order samples of the salmon jerky and calming chews so you can take real photos — product photos with your own dog convert 3× better." },
    { timeframe: "Week 2", task: "Launch on TikTok", detail: "Post 3 videos: your dog reacting to a treat, an unboxing, and a 'why I started this' story. Raw and authentic beats polished." },
    { timeframe: "Week 3", task: "Run your first ad", detail: "Set up a $5/day Facebook ad targeting 'dog owner' + 'natural pet food' interests. Run it for 7 days before judging results." },
    { timeframe: "Week 4", task: "Set up abandoned cart emails", detail: "Install Klaviyo (free plan) and set a 1-hour abandoned cart email with a 10% discount code. This alone recovers 10–15% of lost sales." },
    { timeframe: "Month 2", task: "Scale what's working", detail: "Check which product got the most add-to-carts. Double your ad spend on it and create a bundle deal to increase average order value." },
  ],
};

const MOCK_ISSUES = [
  { id: "1", severity: 3, title: "Your store is still password-protected", explanation: "Your store is still password protected. Customers can't visit it yet — remove the password to go live and start getting traffic.", status: "open" },
  { id: "2", severity: 3, title: "You can't accept payments yet", explanation: "Without a payment method set up, customers can't actually pay you. Setting up Shopify Payments only takes a few minutes.", status: "open" },
  { id: "3", severity: 2, title: "You haven't created any product categories yet", explanation: "Collections help shoppers browse and find products. Without them, your store can feel disorganized.", status: "open" },
  { id: "4", severity: 1, title: "Your store is missing a browser icon (favicon)", explanation: "A favicon is the tiny icon that shows in browser tabs. It makes your store look professional.", status: "applied" },
];

const MOCK_CONTENT = [
  { id: "1", platform: "tiktok", contentText: "POV: your rescue dog has rejected 14 different treat brands and you finally find the one 😭🐾 She literally did a little happy dance. Link in bio for anyone else with a picky pup.", hashtags: ["rescuedog", "pickydogmom", "dogtreat", "pawsandco", "dogtok"], used: false },
  { id: "2", platform: "instagram", contentText: "Single ingredient. No fillers. No mystery meat. Just wild salmon your dog can actually taste. Mango gives it 5 paws out of 5. 🐟🐾\n\nTap the link in our bio to try a bag — we ship within 2 days.", hashtags: ["naturaldog", "dogfood", "singleingredient", "healthydog", "dogsofinstagram"], used: false },
  { id: "3", platform: "pinterest", contentText: "The 5 best single-ingredient dog treats for dogs with food allergies or sensitive stomachs. Vet-approved and dog-tested.", hashtags: ["doghealth", "petcare", "allergicdog", "dogtreat", "naturalpetfood"], used: true },
  { id: "4", platform: "tiktok", contentText: "Honest review: I tried 6 'calming treat' brands on my anxious dog before finding one that actually works. Here's what the difference looks like 👇", hashtags: ["anxiousdog", "calmingdog", "dogmom", "petreview", "dogtok"], used: false },
  { id: "5", platform: "instagram", contentText: "Did you know most dog treats contain more than 15 ingredients — most of which you can't pronounce? We kept it simple. One ingredient. Real food. Happy dog. 🐶", hashtags: ["cleaneating", "dognutrition", "realfood", "pawsandco", "doglife"], used: false },
];

// ─── Nav screens ──────────────────────────────────────────────────────────────

const SCREENS = ["welcome", "quiz", "generating", "dashboard", "plan", "content", "issues"];

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

function Sidebar({ current, onNav }) {
  const items = [
    { id: "welcome",    label: "Welcome screen" },
    { id: "quiz",       label: "Quiz (8 steps)" },
    { id: "generating", label: "Generating..." },
    { id: "dashboard",  label: "Dashboard" },
    { id: "plan",       label: "Store plan" },
    { id: "content",    label: "Social content" },
    { id: "issues",     label: "Health issues" },
  ];

  return (
    <div style={{
      width: 220, flexShrink: 0, background: "#f6f6f7",
      borderRight: "1px solid #e1e3e5", padding: "16px 0",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ padding: "0 16px 12px", borderBottom: "1px solid #e1e3e5", marginBottom: 8 }}>
        <Text variant="headingMd" as="p">StoreBuilt</Text>
        <Text variant="bodySm" tone="subdued" as="p">UI Preview</Text>
      </div>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNav(item.id)}
          style={{
            display: "block", width: "100%", textAlign: "left",
            padding: "8px 16px", border: "none", cursor: "pointer",
            background: current === item.id ? "#e3e8ff" : "transparent",
            color: current === item.id ? "#3c4fe0" : "#202223",
            fontWeight: current === item.id ? 600 : 400,
            fontSize: 14, borderRadius: 0,
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Screen: Welcome ─────────────────────────────────────────────────────────

function WelcomeScreen({ onNext }) {
  return (
    <Page narrowWidth>
      <Card>
        <BlockStack gap="600">
          <BlockStack gap="300">
            <Text variant="headingXl" as="h1" alignment="center">
              Let's build your store together
            </Text>
            <Text variant="bodyLg" tone="subdued" alignment="center" as="p">
              Answer 8 quick questions and we'll set up everything for you
            </Text>
          </BlockStack>
          <Divider />
          <BlockStack gap="300">
            {[
              ["📝", "We write all your content", "Your About Us page, refund policy, and shipping info — written for you in plain English that builds trust with shoppers."],
              ["💡", "5 product ideas with sourcing tips", "Specific products to sell, where to get them, what to charge, and how much you can make on each one."],
              ["🗓️", "A 30-day plan made for you", "Step-by-step daily actions so you always know exactly what to do next — even if you've never sold anything online before."],
            ].map(([icon, title, desc]) => (
              <InlineStack key={title} gap="300" blockAlign="start">
                <Text variant="bodyLg" as="span">{icon}</Text>
                <BlockStack gap="100">
                  <Text variant="bodyMd" fontWeight="semibold" as="p">{title}</Text>
                  <Text variant="bodySm" tone="subdued" as="p">{desc}</Text>
                </BlockStack>
              </InlineStack>
            ))}
          </BlockStack>
          <Button variant="primary" size="large" onClick={onNext} fullWidth>
            Start building my store →
          </Button>
          <Text variant="bodySm" tone="subdued" alignment="center" as="p">
            Takes about 2 minutes. No credit card needed to start.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
}

// ─── Screen: Quiz ─────────────────────────────────────────────────────────────

const STEPS = [
  { field: "productType", label: "What are you thinking of selling?", sub: "Pick the closest thing — you can always change your mind later", type: "tiles", columns: 2,
    options: [
      { value: "physical", label: "Physical products", description: "Clothes, gadgets, home goods" },
      { value: "digital",  label: "Digital products",  description: "PDFs, courses, templates" },
      { value: "dropship", label: "Dropshipping",       description: "Sell without holding inventory" },
      { value: "handmade", label: "Handmade / crafts",  description: "Things you make yourself" },
      { value: "print",    label: "Print-on-demand",    description: "Custom designs on clothing, mugs" },
      { value: "notsure",  label: "Not sure yet",       description: "Help me figure it out" },
    ]},
  { field: "niche", label: "What is your store about?", sub: "Be as specific as you can — the more detail, the better your store", type: "text", placeholder: "e.g. organic dog treats, women's yoga gear, vintage gaming...", minLength: 3 },
  { field: "experience", label: "Have you ever run an online store before?", sub: "This helps us decide how much to explain vs. just do for you", type: "tiles", columns: 1,
    options: [
      { value: "never", label: "No, this is my first time",          description: "Complete beginner" },
      { value: "tried", label: "I've tried but made no sales",       description: "Set up a store, didn't work out" },
      { value: "some",  label: "I've made some sales before",        description: "Know basics, want to do better" },
    ]},
  { field: "timePerWeek", label: "How many hours per week can you give this?", sub: "Be honest — we'll automate more if you have less time", type: "tiles", columns: 1,
    options: [
      { value: "low",  label: "Under 5 hours", description: "Side project — automate almost everything" },
      { value: "med",  label: "5–15 hours",    description: "Part-time — mix of manual and automated" },
      { value: "high", label: "15+ hours",     description: "Full focus — I'm going all in on this" },
    ]},
  { field: "budget", label: "What's your starting budget for the business?", sub: "This determines which business model makes sense for you right now", type: "tiles", columns: 1,
    options: [
      { value: "none", label: "Zero — start for free", description: "Recommended: print-on-demand" },
      { value: "low",  label: "Under $200",            description: "Recommended: dropshipping" },
      { value: "med",  label: "$200 – $1,000",         description: "Recommended: branded dropshipping" },
      { value: "high", label: "$1,000+",               description: "Recommended: small inventory" },
    ]},
  { field: "goal", label: "What's the main goal for your store?", sub: "This shapes your entire strategy — different goals need different plans", type: "tiles", columns: 1,
    options: [
      { value: "extra",   label: "Extra income on the side",  description: "Even $500/month would make a difference" },
      { value: "replace", label: "Replace my job income",     description: "I need this to work full-time" },
      { value: "brand",   label: "Build a real brand",        description: "Long-term, something I'm proud of" },
      { value: "test",    label: "Just testing an idea",      description: "See if this works before committing" },
    ]},
  { field: "storeName", label: "What do you want to call your store?", sub: "Don't overthink it — you can always change this later", type: "text", placeholder: "e.g. Pawsome Co., GreenLeaf Studio, Drift Supply...", minLength: 2 },
  { field: "email", label: "Last step — what's your email address?", sub: "We'll send your complete store plan and first-week checklist here", type: "email", placeholder: "you@email.com" },
];

function OptionTile({ value, label, description, selected, onSelect }) {
  return (
    <button onClick={() => onSelect(value)} style={{
      cursor: "pointer", textAlign: "left", width: "100%",
      border: `2px solid ${selected ? "#5c6ac4" : "#d1d5db"}`,
      background: selected ? "#f0f0ff" : "white",
      borderRadius: 8, padding: 16, transition: "all 0.15s ease",
    }}>
      <BlockStack gap="100">
        <Text variant="bodyMd" fontWeight="semibold" as="span">{label}</Text>
        {description && <Text variant="bodySm" tone="subdued" as="span">{description}</Text>}
      </BlockStack>
    </button>
  );
}

function QuizScreen({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ productType: "", niche: "", experience: "", timePerWeek: "", budget: "", goal: "", storeName: "", email: "" });

  const current = STEPS[step];
  const value = answers[current.field];
  const progress = ((step + 1) / STEPS.length) * 100;

  const isValid = () => {
    if (!value) return false;
    if (current.type === "text") return value.trim().length >= (current.minLength || 1);
    if (current.type === "email") return value.includes("@") && value.length >= 5;
    return !!value;
  };

  const handleContinue = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onFinish();
  };

  return (
    <Page narrowWidth>
      <BlockStack gap="600">
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <Text variant="bodySm" tone="subdued">Step {step + 1} of {STEPS.length}</Text>
            <Text variant="bodySm" tone="subdued">{Math.round(progress)}% done</Text>
          </InlineStack>
          <ProgressBar progress={progress} size="small" tone="primary" />
        </BlockStack>
        <Card>
          <BlockStack gap="500">
            <BlockStack gap="200">
              <Text variant="headingLg" as="h2">{current.label}</Text>
              <Text variant="bodyMd" tone="subdued">{current.sub}</Text>
            </BlockStack>
            <Divider />
            {current.type === "tiles" && (
              <div style={{ display: "grid", gridTemplateColumns: current.columns === 2 ? "1fr 1fr" : "1fr", gap: 12 }}>
                {current.options.map(opt => (
                  <OptionTile key={opt.value} {...opt} selected={value === opt.value} onSelect={v => setAnswers(a => ({ ...a, [current.field]: v }))} />
                ))}
              </div>
            )}
            {(current.type === "text" || current.type === "email") && (
              <TextField label="" labelHidden value={value} onChange={v => setAnswers(a => ({ ...a, [current.field]: v }))} placeholder={current.placeholder} type={current.type === "email" ? "email" : "text"} autoComplete="off" />
            )}
            <InlineStack gap="300" align="space-between">
              {step > 0 ? <Button onClick={() => setStep(s => s - 1)}>Back</Button> : <div />}
              <Button variant="primary" tone="success" onClick={handleContinue} disabled={!isValid()}>
                {step === STEPS.length - 1 ? "Build my store now →" : "Continue →"}
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
        <Text variant="bodySm" tone="subdued" alignment="center" as="p">
          Your answers are private and only used to set up your store.
        </Text>
      </BlockStack>
    </Page>
  );
}

// ─── Screen: Generating ───────────────────────────────────────────────────────

const GEN_STEPS = [
  "Reading your answers",
  "Researching your niche",
  "Writing your store content",
  "Creating your product ideas",
  "Building your 30-day plan",
  "Writing your social content",
  "Applying everything to your store",
];

function GeneratingScreen({ onDone }) {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setActiveStep(s => {
        if (s >= GEN_STEPS.length - 1) { clearInterval(t); setDone(true); setTimeout(onDone, 600); return s; }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <Page narrowWidth>
      <BlockStack gap="600">
        <BlockStack gap="200">
          <Text variant="headingXl" as="h1" alignment="center">Building your store...</Text>
          <Text variant="bodyMd" tone="subdued" alignment="center" as="p">
            This takes about 60 seconds. We're doing a lot behind the scenes.
          </Text>
        </BlockStack>
        <Card>
          <BlockStack gap="400">
            {GEN_STEPS.map((label, i) => {
              const state = done || i < activeStep ? "done" : i === activeStep ? "active" : "waiting";
              return (
                <InlineStack key={label} gap="300" blockAlign="center">
                  {state === "done"    && <span style={{ color: "#00a651", fontSize: 18, width: 24 }}>✓</span>}
                  {state === "active"  && <span style={{ width: 24 }}><Spinner size="small" /></span>}
                  {state === "waiting" && <span style={{ color: "#d1d5db", fontSize: 18, width: 24 }}>○</span>}
                  <Text variant="bodyMd" tone={state === "waiting" ? "subdued" : undefined} fontWeight={state === "active" ? "semibold" : undefined}>
                    {label}
                  </Text>
                </InlineStack>
              );
            })}
          </BlockStack>
        </Card>
        <Text variant="bodySm" tone="subdued" alignment="center" as="p">
          Keep this tab open — we'll redirect you automatically when everything is ready.
        </Text>
      </BlockStack>
    </Page>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────

function DashboardScreen({ onNav }) {
  const healthScore = 62;
  const milestones = ["first_sale"];
  const ALL_MILESTONES = [{ type: "first_sale", label: "First sale" }, { type: "revenue_500", label: "$500 revenue" }, { type: "revenue_1k", label: "$1,000 revenue" }, { type: "revenue_5k", label: "$5,000 revenue" }];
  const unlockedTypes = new Set(milestones);
  const PLATFORM = { tiktok: "TikTok", instagram: "Instagram", pinterest: "Pinterest" };

  return (
    <Page title="Welcome back, Paws & Co.!" subtitle="Here's how your store is doing">
      <Layout>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300" align="center">
              <Text variant="headingMd" as="h3">Store health score</Text>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#f49342", lineHeight: 1 }}>{healthScore}</div>
              <Text variant="bodySm" tone="subdued" alignment="center" as="p">Needs attention · 4 checks · 1 issue fixed</Text>
              <Button size="slim" onClick={() => onNav("issues")}>See all issues</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h3">Quick stats</Text>
              {[["Total revenue", "$0.00"], ["Issues fixed", "1"], ["Billing", null]].map(([label, val]) => (
                <InlineStack key={label} align="space-between">
                  <Text variant="bodyMd" as="span">{label}</Text>
                  {val ? <Text variant="bodyMd" fontWeight="semibold" as="span">{val}</Text>
                       : <Badge tone="attention">Free (30-day trial)</Badge>}
                </InlineStack>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h3">Milestones</Text>
              {ALL_MILESTONES.map(({ type, label }) => (
                <InlineStack key={type} gap="200" blockAlign="center">
                  <Text variant="bodyMd" tone={unlockedTypes.has(type) ? undefined : "subdued"} as="span">{unlockedTypes.has(type) ? "✓" : "○"}</Text>
                  <Text variant="bodyMd" tone={unlockedTypes.has(type) ? undefined : "subdued"} as="span">{label}</Text>
                  {unlockedTypes.has(type) && <Badge tone="success">Done</Badge>}
                </InlineStack>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text variant="headingLg" as="h3">Issues to fix</Text>
              <Button plain onClick={() => onNav("issues")}>See all issues →</Button>
            </InlineStack>
            {MOCK_ISSUES.filter(i => i.status === "open").slice(0, 3).map(issue => (
              <Card key={issue.id}>
                <InlineStack align="space-between" blockAlign="center" wrap={false}>
                  <BlockStack gap="100">
                    <Badge tone={issue.severity === 3 ? "critical" : issue.severity === 2 ? "warning" : "attention"}>
                      {issue.severity === 3 ? "High" : issue.severity === 2 ? "Medium" : "Low"}
                    </Badge>
                    <Text variant="bodyMd" fontWeight="semibold" as="p">{issue.title}</Text>
                    <Text variant="bodySm" tone="subdued" as="p">{issue.explanation.slice(0, 90)}...</Text>
                  </BlockStack>
                  <Button size="slim" onClick={() => onNav("issues")}>Fix this →</Button>
                </InlineStack>
              </Card>
            ))}
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text variant="headingLg" as="h3">Your content queue</Text>
              <Button plain onClick={() => onNav("content")}>See all 30 posts →</Button>
            </InlineStack>
            <Card>
              <BlockStack gap="300">
                {MOCK_CONTENT.slice(0, 3).map((item, i) => (
                  <BlockStack key={item.id} gap="100">
                    <Badge tone="info">{PLATFORM[item.platform]}</Badge>
                    <Text variant="bodyMd" as="p">{item.contentText.slice(0, 110)}...</Text>
                    {i < 2 && <Divider />}
                  </BlockStack>
                ))}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingLg" as="h3">Your 30-day launch plan</Text>
              {MOCK_PLAN.roadmapItems.map((item, i) => (
                <BlockStack key={i} gap="100">
                  <InlineStack gap="200" blockAlign="center">
                    <Badge>{item.timeframe}</Badge>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">{item.task}</Text>
                  </InlineStack>
                  <Text variant="bodySm" tone="subdued" as="p">{item.detail}</Text>
                  {i < MOCK_PLAN.roadmapItems.length - 1 && <Divider />}
                </BlockStack>
              ))}
              <Button size="slim" onClick={() => onNav("plan")}>View full store plan</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// ─── Screen: Plan ─────────────────────────────────────────────────────────────

function PlanScreen() {
  const [applied, setApplied] = useState(false);
  return (
    <Page title="Your Paws & Co. Plan" subtitle="Everything we've prepared for your store" backAction={{ content: "Dashboard" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack gap="300" blockAlign="center" wrap={false}>
              <BlockStack gap="100">
                <Text variant="headingXl" as="h2">{MOCK_PLAN.storeName}</Text>
                <Text variant="bodyLg" tone="subdued" as="p">{MOCK_PLAN.tagline}</Text>
              </BlockStack>
              <div style={{ marginLeft: "auto", width: 48, height: 48, borderRadius: 8, background: MOCK_PLAN.colorScheme }} />
            </InlineStack>
            <div style={{ marginTop: 12 }}>
              <InlineStack gap="200">
                <Badge tone="info">Casual & Friendly</Badge>
                <Badge>{MOCK_PLAN.colorScheme}</Badge>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Banner title="Your recommended business model: Dropshipping" tone="info">
            <Text as="p">{MOCK_PLAN.modelReason}</Text>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          {applied ? (
            <Banner title="Your store content has been applied" tone="success">
              <Text as="p">Your pages, policies, and metafields have been written to your Shopify store.</Text>
            </Banner>
          ) : (
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">Ready to apply everything to your store?</Text>
                <Text variant="bodyMd" tone="subdued" as="p">We'll write your About Us page, Refund Policy, and Shipping Info directly to your Shopify store. This takes about 30 seconds.</Text>
                <Button variant="primary" size="large" onClick={() => setApplied(true)}>Apply everything to my store</Button>
              </BlockStack>
            </Card>
          )}
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h3">Your 5 product ideas</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
              {MOCK_PLAN.productIdeas.map((p, i) => (
                <Card key={i}>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h4">{p.name}</Text>
                    <Text variant="bodyMd" as="p">{p.description}</Text>
                    <Divider />
                    <Text variant="bodySm" tone="subdued" as="p"><strong>Where to source it:</strong> {p.sourceHint}</Text>
                    <InlineStack gap="200">
                      <Badge>{p.priceRange}</Badge>
                      <Text variant="bodySm" tone="subdued" as="span">{p.marginNote}</Text>
                    </InlineStack>
                  </BlockStack>
                </Card>
              ))}
            </div>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h3">Your 30-day launch roadmap</Text>
              <IndexTable resourceName={{ singular: "task", plural: "tasks" }} itemCount={MOCK_PLAN.roadmapItems.length} headings={[{ title: "Timeframe" }, { title: "Task" }, { title: "What to do" }]} selectable={false}>
                {MOCK_PLAN.roadmapItems.map((item, i) => (
                  <IndexTable.Row id={String(i)} key={i} position={i}>
                    <IndexTable.Cell><Badge tone="info">{item.timeframe}</Badge></IndexTable.Cell>
                    <IndexTable.Cell><Text variant="bodyMd" fontWeight="semibold" as="span">{item.task}</Text></IndexTable.Cell>
                    <IndexTable.Cell><Text variant="bodyMd" tone="subdued" as="span">{item.detail}</Text></IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// ─── Screen: Content ──────────────────────────────────────────────────────────

const PLATFORM_TONES = { tiktok: "attention", instagram: "info", pinterest: "critical" };
const PLATFORM_LABELS = { tiktok: "TikTok", instagram: "Instagram", pinterest: "Pinterest" };

function ContentScreen() {
  const [items, setItems] = useState(MOCK_CONTENT);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(null);

  const filter = ["all", "tiktok", "instagram", "pinterest"][tab];
  const filtered = filter === "all" ? items : items.filter(i => i.platform === filter);

  const markUsed = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, used: true } : i));
  const copy = (id, text) => { navigator.clipboard?.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <Page title="Your social media content" subtitle="Ready-to-post content for TikTok, Instagram, and Pinterest" backAction={{ content: "Dashboard" }}>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <InlineStack gap="400">
                {[["unused", items.filter(i => !i.used).length, "posts ready to use"], ["used", items.filter(i => i.used).length, "posts marked as used"], ["total", items.length, "total posts"]].map(([k, n, label]) => (
                  <BlockStack key={k} gap="100">
                    <Text variant="headingMd" as="p">{n}</Text>
                    <Text variant="bodySm" tone="subdued">{label}</Text>
                  </BlockStack>
                ))}
              </InlineStack>
            </Card>
            <Tabs tabs={[{ id: "all", content: "All", panelID: "a" }, { id: "tiktok", content: "TikTok", panelID: "b" }, { id: "instagram", content: "Instagram", panelID: "c" }, { id: "pinterest", content: "Pinterest", panelID: "d" }]} selected={tab} onSelect={setTab} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
              {filtered.map(item => (
                <Card key={item.id}>
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <Badge tone={PLATFORM_TONES[item.platform]}>{PLATFORM_LABELS[item.platform]}</Badge>
                      {item.used && <Badge tone="success">Used</Badge>}
                    </InlineStack>
                    <Text variant="bodyMd" as="p">{item.contentText}</Text>
                    <InlineStack gap="100" wrap>
                      {item.hashtags.map(tag => <Tag key={tag}>#{tag}</Tag>)}
                    </InlineStack>
                    <Divider />
                    <InlineStack gap="200">
                      <Button size="slim" onClick={() => copy(item.id, item.contentText)}>{copied === item.id ? "Copied!" : "Copy text"}</Button>
                      {!item.used && <Button size="slim" tone="success" onClick={() => markUsed(item.id)}>Mark as used</Button>}
                    </InlineStack>
                  </BlockStack>
                </Card>
              ))}
            </div>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// ─── Screen: Issues ───────────────────────────────────────────────────────────

function IssuesScreen() {
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [tab, setTab] = useState(0);

  const fix = (id) => setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "applied" } : i));
  const dismiss = (id) => setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "dismissed" } : i));

  const severityFilter = [null, 3, 2, 1][tab];
  const filtered = issues.filter(i => i.status !== "dismissed" && (!severityFilter || i.severity === severityFilter));

  return (
    <Page title="Store health issues" subtitle="Things we found that could be hurting your sales" backAction={{ content: "Dashboard" }}>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <InlineStack gap="400">
                <BlockStack gap="100"><Text variant="headingMd" as="p">{issues.filter(i => i.status === "open").length}</Text><Text variant="bodySm" tone="subdued">open issues</Text></BlockStack>
                <BlockStack gap="100"><Text variant="headingMd" as="p">{issues.filter(i => i.status === "applied").length}</Text><Text variant="bodySm" tone="subdued">issues fixed</Text></BlockStack>
              </InlineStack>
            </Card>
            <Tabs tabs={[{ id: "all", content: "All issues", panelID: "a" }, { id: "high", content: "High priority", panelID: "b" }, { id: "med", content: "Medium priority", panelID: "c" }, { id: "low", content: "Low priority", panelID: "d" }]} selected={tab} onSelect={setTab} />
            <BlockStack gap="300">
              {filtered.map(issue => (
                <Card key={issue.id}>
                  <BlockStack gap="300">
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone={issue.severity === 3 ? "critical" : issue.severity === 2 ? "warning" : "attention"}>
                        {issue.severity === 3 ? "High priority" : issue.severity === 2 ? "Medium priority" : "Low priority"}
                      </Badge>
                      {issue.status === "applied" && <Badge tone="success">Fixed</Badge>}
                    </InlineStack>
                    <Text variant="headingMd" as="h3">{issue.title}</Text>
                    <Text variant="bodyMd" tone="subdued" as="p">{issue.explanation}</Text>
                    {issue.status === "open" && (
                      <>
                        <Divider />
                        <InlineStack gap="200">
                          <Button variant="primary" onClick={() => fix(issue.id)}>Fix this for me</Button>
                          <Button variant="plain" tone="subdued" onClick={() => dismiss(issue.id)}>Dismiss</Button>
                        </InlineStack>
                      </>
                    )}
                  </BlockStack>
                </Card>
              ))}
            </BlockStack>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("welcome");

  const renderScreen = () => {
    switch (screen) {
      case "welcome":    return <WelcomeScreen onNext={() => setScreen("quiz")} />;
      case "quiz":       return <QuizScreen onFinish={() => setScreen("generating")} />;
      case "generating": return <GeneratingScreen onDone={() => setScreen("dashboard")} />;
      case "dashboard":  return <DashboardScreen onNav={setScreen} />;
      case "plan":       return <PlanScreen />;
      case "content":    return <ContentScreen />;
      case "issues":     return <IssuesScreen />;
      default:           return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Sidebar current={screen} onNav={setScreen} />
      <div style={{ flex: 1, overflowY: "auto", background: "#f6f6f7" }}>
        {renderScreen()}
      </div>
    </div>
  );
}
