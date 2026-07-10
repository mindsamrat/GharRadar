// Run with: node --experimental-strip-types --test src/lib/maharera/parse.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseProjectDetail,
  extractDetailUrl,
  looksLikeProjectPage,
  textCells,
  decodeEntities,
} from "./parse.ts";

// A table-style detail page (older MahaRERA vintage).
const tableHtml = `
<html><body>
<table>
  <tr><td>Project Name</td><td>Sunrise Heights</td></tr>
  <tr><td>Promoter Name</td><td>Acme Developers LLP</td></tr>
  <tr><td>Project Type</td><td>Residential</td></tr>
  <tr><td>Project Status</td><td>New Project</td></tr>
  <tr><td>Registration Date</td><td>12/03/2023</td></tr>
  <tr><td>Proposed Date of Completion</td><td>31/12/2027</td></tr>
  <tr><td>District</td><td>Mumbai Suburban</td></tr>
  <tr><td>Taluka</td><td>Andheri</td></tr>
  <tr><td>Village</td><td>Versova</td></tr>
  <tr><td>Pin Code</td><td>400061</td></tr>
  <tr><td>Total Number of Buildings</td><td>3</td></tr>
</table>
</body></html>`;

// A label/span-style detail page (newer vintage) with entities & nesting.
const labelHtml = `
<div class="project">
  <div class="row"><label>Project Name</label><span><b>Green &amp; Co Residency</b></span></div>
  <div class="row"><label>Promoter</label><span>Green Estates Pvt. Ltd.</span></div>
  <div class="row"><label>Registration Number</label><span>P51900099999</span></div>
  <div class="row"><label>Proposed Completion Date</label><span>30/06/2026</span></div>
  <div class="row"><label>Total Number of Apartments</label><span>248</span></div>
  <div class="row"><label>District</label><span>Pune</span></div>
</div>`;

test("decodeEntities handles named + numeric entities", () => {
  assert.equal(decodeEntities("A &amp; B &#39;x&#39; &nbsp;end"), "A & B 'x'  end");
});

test("textCells flattens tags into ordered chunks", () => {
  const cells = textCells("<td>Label</td><td>Value</td>");
  assert.deepEqual(cells, ["Label", "Value"]);
});

test("parses a table-style detail page", () => {
  const p = parseProjectDetail(tableHtml, "P51900047880", "http://x/detail");
  assert.equal(p.name, "Sunrise Heights");
  assert.equal(p.promoter, "Acme Developers LLP");
  assert.equal(p.projectType, "Residential");
  assert.equal(p.status, "New Project");
  assert.equal(p.registeredOn, "12/03/2023");
  assert.equal(p.proposedCompletion, "31/12/2027");
  assert.equal(p.district, "Mumbai Suburban");
  assert.equal(p.taluka, "Andheri");
  assert.equal(p.village, "Versova");
  assert.equal(p.pincode, "400061");
  assert.equal(p.totalBuildings, "3");
  assert.ok(looksLikeProjectPage(p));
});

test("parses a label/span-style detail page with entities", () => {
  const p = parseProjectDetail(labelHtml, "P51900099999");
  assert.equal(p.name, "Green & Co Residency");
  assert.equal(p.promoter, "Green Estates Pvt. Ltd.");
  assert.equal(p.proposedCompletion, "30/06/2026");
  assert.equal(p.totalApartments, "248");
  assert.equal(p.district, "Pune");
});

test("does not return an adjacent label as a value", () => {
  // "Village" has no value cell before the next label — must stay undefined.
  const html = "<td>Village</td><td>Pin Code</td><td>400001</td>";
  const p = parseProjectDetail(html, "P1");
  assert.equal(p.village, undefined);
  assert.equal(p.pincode, "400001");
});

test("unread fields are left undefined (never fabricated)", () => {
  const p = parseProjectDetail("<td>Project Name</td><td>Only Name</td>", "P1");
  assert.equal(p.name, "Only Name");
  assert.equal(p.totalArea, undefined);
  assert.equal(p.litigations, undefined);
});

test("extractDetailUrl prefers an anchor referencing the rera number", () => {
  const html = `
    <a href="/other">Home</a>
    <a href="/project-details?id=42&cert=P51900047880">View P51900047880</a>
    <a href="/faq">FAQ</a>`;
  const url = extractDetailUrl(html, "P51900047880", "https://maharera.example");
  assert.equal(url, "https://maharera.example/project-details?id=42&cert=P51900047880");
});

test("looksLikeProjectPage is false for an empty parse", () => {
  assert.equal(looksLikeProjectPage({ rera: "P1" }), false);
});
