/* ============================================================
   Anupama Nrithyalaya — cohorts list + registration form
   Reads settings from dance-data.js (window.ANUPAMA_DANCE).
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.ANUPAMA_DANCE || {};
  var cohorts = (cfg.cohorts || []).filter(function (c) { return c && c.published && c.title; });
  var STATUS = {
    open: { text: "Open for registration", cta: "Enquire about this cohort" },
    soon: { text: "Opening soon", cta: "Register interest" },
    full: { text: "Full", cta: "Ask about the next cohort" }
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* ---------- Cohorts ---------- */
  var list = document.getElementById("cohort-list");
  if (list && cohorts.length) {
    list.textContent = "";
    cohorts.forEach(function (c) {
      var st = STATUS[c.status] || STATUS.soon;
      var item = el("li", "cohort");
      item.id = "cohort-" + c.id;

      var head = el("div");
      if (c.style) head.appendChild(el("p", "style label", c.style));
      head.appendChild(el("h3", null, c.title));
      if (c.description) head.appendChild(el("p", "desc", c.description));
      item.appendChild(head);

      var dl = el("dl");
      [
        ["Level", c.level], ["Ages", c.ages], ["When", c.schedule], ["Duration", c.duration],
        ["Format", c.format], ["Where", c.location], ["Starts", c.startDate], ["Fee", c.fee], ["Seats", c.seats]
      ].forEach(function (pair) {
        if (!pair[1]) return;
        dl.appendChild(el("dt", null, pair[0]));
        dl.appendChild(el("dd", null, pair[1]));
      });
      item.appendChild(dl);

      var act = el("div", "act");
      act.appendChild(el("span", "status status--" + (STATUS[c.status] ? c.status : "soon"), st.text));
      var a = el("a", "btn" + (c.status === "open" ? " btn--solid" : ""), st.cta);
      a.href = "#register";
      a.setAttribute("data-cohort", c.id);
      a.setAttribute("aria-label", st.cta + ": " + c.title);
      act.appendChild(a);
      item.appendChild(act);

      list.appendChild(item);
    });
  }

  /* ---------- Form: cohort options ---------- */
  var form = document.getElementById("enquiry");
  if (!form) return;

  var select = form.elements.cohort;
  var anchor = select.querySelector("[data-after-cohorts]");
  cohorts.forEach(function (c) {
    var o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.title + (c.status === "full" ? " (full — next cohort)" : "");
    select.insertBefore(o, anchor);
  });

  // "Enquire" buttons preselect their cohort.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-cohort]");
    if (a) select.value = a.getAttribute("data-cohort");
  });
  // Support links like /dance/?cohort=id#register
  var qp = new URLSearchParams(location.search).get("cohort");
  if (qp && select.querySelector('option[value="' + CSS.escape(qp) + '"]')) select.value = qp;

  /* ---------- Guardian field for minors ---------- */
  var age = form.elements.age_group;
  var guardianField = document.getElementById("f-guardian");
  function syncGuardian() {
    var minor = age.value === "Under 13" || age.value === "13–17";
    guardianField.hidden = !minor;
    form.elements.guardian_name.required = minor;
    if (!minor) clearError(form.elements.guardian_name);
  }
  age.addEventListener("change", syncGuardian);
  syncGuardian();

  /* ---------- Validation ---------- */
  var MESSAGES = {
    student_name: "Please add the student’s name.",
    age_group: "Please choose an age group.",
    guardian_name: "Please add a parent or guardian’s name.",
    phone: "Please add a contact number we can reach you on.",
    email: "That email doesn’t look quite right.",
    cohort: "Please choose a class, or “Not sure yet”.",
    consent: "Please confirm so we can contact you about this enquiry."
  };
  function errorNode(input) { return document.getElementById("err-" + input.name); }
  function setError(input, msg) {
    input.setAttribute("aria-invalid", "true");
    var n = errorNode(input);
    if (n) n.textContent = msg;
  }
  function clearError(input) {
    input.removeAttribute("aria-invalid");
    var n = errorNode(input);
    if (n) n.textContent = "";
  }
  function check(input) {
    if (input.closest("[hidden]")) { clearError(input); return true; }
    var v = input.type === "checkbox" ? input.checked : input.value.trim();
    var ok = true;
    if (input.required && !v) ok = false;
    if (ok && input.name === "phone" && v && v.replace(/\D/g, "").length < 8) ok = false;
    if (ok && input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
    if (ok) clearError(input); else setError(input, MESSAGES[input.name] || "Please check this field.");
    return ok;
  }
  var fields = Array.prototype.filter.call(form.elements, function (i) { return MESSAGES[i.name]; });
  fields.forEach(function (i) {
    i.addEventListener("blur", function () { if (i.value || i.getAttribute("aria-invalid")) check(i); });
    i.addEventListener("change", function () { if (i.getAttribute("aria-invalid")) check(i); });
  });

  /* ---------- Submission ---------- */
  var status = document.getElementById("form-status");
  var submit = form.querySelector('button[type="submit"]');
  var submitLabel = submit.querySelector(".lbl");
  var thanks = document.getElementById("thanks");
  var endpoint = (cfg.formEndpoint || "").trim();
  var email = cfg.contactEmail || "";

  if (!endpoint) {
    submitLabel.textContent = "Continue in email";
    document.getElementById("form-mode-note").textContent =
      "Online registration is being set up. For now, this opens your email app with your enquiry filled in — it reaches us once you press send.";
  }

  function summary(data) {
    var cohortText = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : data.get("cohort");
    return [
      "Student: " + data.get("student_name"),
      "Age group: " + data.get("age_group"),
      data.get("guardian_name") ? "Parent/guardian: " + data.get("guardian_name") : "",
      "Phone: " + data.get("phone"),
      data.get("email") ? "Email: " + data.get("email") : "",
      "Class / cohort: " + cohortText,
      data.get("experience") ? "Experience: " + data.get("experience") : "",
      data.get("message") ? "\nMessage:\n" + data.get("message") : ""
    ].filter(Boolean).join("\n");
  }

  function showError(msg) {
    status.className = "form-status is-error";
    status.textContent = msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var bad = fields.filter(function (i) { return !check(i); });
    if (bad.length) {
      bad[0].focus();
      showError("Please check the highlighted field" + (bad.length > 1 ? "s" : "") + ".");
      return;
    }
    if (form.elements._gotcha.value) return; // bot

    var data = new FormData(form);

    if (!endpoint) {
      var subject = "Anupama Nrithyalaya enquiry — " + data.get("student_name");
      location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(summary(data) + "\n");
      status.className = "form-status";
      status.textContent = "Your email app should now be open with the enquiry ready. It’s only sent once you press send there. If nothing opened, write to " + email + ".";
      return;
    }

    data.delete("_gotcha");
    var extra = cfg.formExtraFields || {};
    Object.keys(extra).forEach(function (k) { data.append(k, extra[k]); });
    data.append("summary", summary(data));
    data.append("_subject", "Anupama Nrithyalaya enquiry — " + data.get("student_name"));

    form.classList.add("is-sending");
    submit.disabled = true;
    submitLabel.textContent = "Sending…";

    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          // Success only when the service confirms it — never assumed.
          if (!res.ok || json.success === false || json.ok === false) {
            throw new Error(json.message || (json.errors && json.errors[0] && json.errors[0].message) || "HTTP " + res.status);
          }
        });
      })
      .then(function () {
        form.hidden = true;
        thanks.hidden = false;
        thanks.focus();
      })
      .catch(function () {
        showError("Sorry — your enquiry couldn’t be sent just now. Please try again, or email " + email + " directly.");
      })
      .then(function () {
        form.classList.remove("is-sending");
        submit.disabled = false;
        submitLabel.textContent = "Send enquiry";
      });
  });
})();
