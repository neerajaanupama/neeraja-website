/* ============================================================
   Anupama Nrithyalaya — editable settings & cohorts
   ------------------------------------------------------------
   This is the ONLY file you need to edit to manage classes.
   See README.md → "Managing cohorts" for a walkthrough.
   ============================================================ */
window.ANUPAMA_DANCE = {

  /* Where registration enquiries are sent.
     Leave "" until a form service is connected (README → "Making registration live").
     While empty, the form falls back to opening a pre-filled email instead —
     it never pretends an enquiry was received. */
  formEndpoint: "",

  /* Extra hidden fields some services need, e.g. Web3Forms:
     { access_key: "your-key", subject: "New Anupama Nrithyalaya enquiry" } */
  formExtraFields: {},

  /* Used for the email fallback and shown on the page. */
  contactEmail: "neerajaanupama8@gmail.com",

  /* ----------------------------------------------------------
     Cohorts
     - Only cohorts with  published: true  appear on the site.
     - Any field left as "" is simply not shown — no empty labels.
     - status: "open" | "soon" | "full"
     - Leave fee / startDate / seats empty until confirmed.
     While no cohort is published, the page shows an honest
     "First cohorts opening soon — register your interest" state.
     ---------------------------------------------------------- */
  cohorts: [
    {
      id: "cohort-template",       // short unique id, no spaces
      published: false,            // ← set to true to show it
      title: "",                   // e.g. "Foundations — Weekend batch"
      style: "Bharatanatyam",      // dance style
      description: "",             // one or two sentences
      level: "",                   // e.g. "Beginners", "Some experience"
      ages: "",                    // e.g. "8–12 years", "Adults"
      schedule: "",                // e.g. "Saturdays, 10–11 am"
      duration: "",                // e.g. "8 weeks"
      format: "",                  // "In person" or "Online"
      location: "",                // area / venue, if in person
      fee: "",                     // only once confirmed
      startDate: "",               // only once confirmed
      seats: "",                   // e.g. "6 seats left" — only if known
      status: "soon"
    }
  ]
};
