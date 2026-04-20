import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Survey from "./Survey";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/test/exec";

// Minimum required answers for the last section (adaptive_features)
const LAST_SECTION_ANSWERS = {
  auto_adjust_reaction: "I'd love it — that's what good programming should do",
  exercise_swap: "I tell the app why (equipment / pain / preference) and it suggests options",
};

// Minimum required answers for section 1 (current_setup)
const SECTION_1_ANSWERS = {
  programming_structure: "Monthly programming with workouts assigned to specific days",
  program_delivery: ["Google Sheets or spreadsheet"],
  other_tools: ["Notes app (iPhone / Google Keep etc.)"],
  reference_during: "Phone — I keep it open on screen",
};

// ─── Intro screen ──────────────────────────────────────────────────────────────

describe("intro screen", () => {
  it("renders the intro heading", () => {
    render(<Survey />);
    expect(screen.getByText(/I'm building an app/i)).toBeInTheDocument();
  });

  it("Start button is disabled when name is empty", () => {
    render(<Survey />);
    expect(screen.getByRole("button", { name: /Start/i })).toBeDisabled();
  });

  it("Start button enables after typing a name", () => {
    render(<Survey />);
    fireEvent.change(screen.getByPlaceholderText(/First name is fine/i), {
      target: { value: "Alex" },
    });
    expect(screen.getByRole("button", { name: /Start/i })).not.toBeDisabled();
  });

  it("pressing Enter in name field advances the step when name is filled", () => {
    render(<Survey />);
    const input = screen.getByPlaceholderText(/First name is fine/i);
    fireEvent.change(input, { target: { value: "Alex" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText(/Section 1 of 5/i)).toBeInTheDocument();
  });
});

// ─── Progress bar accessibility ────────────────────────────────────────────────

describe("progress bar ARIA", () => {
  it("has role=progressbar with correct attributes on intro", () => {
    render(<Survey />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-label", "Survey progress");
  });

  it("updates aria-valuenow when step advances", () => {
    render(<Survey initialStep={1} initialAnswers={SECTION_1_ANSWERS} initialName="Alex" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "20");
  });
});

// ─── Question ARIA roles ───────────────────────────────────────────────────────

describe("single-select ARIA", () => {
  it("renders a radiogroup with radio buttons", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    const groups = screen.getAllByRole("radiogroup");
    expect(groups.length).toBeGreaterThan(0);
    const radios = within(groups[0]).getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(0);
  });

  it("aria-checked reflects selection state", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    fireEvent.click(radios[0]);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
  });
});

describe("multi-select ARIA", () => {
  it("renders checkbox buttons for multi questions", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    // program_delivery is the first multi question in section 1
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("aria-checked toggles on click", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "true");
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");
  });
});

describe("importance grid ARIA", () => {
  it("renders radiogroups for each importance item", () => {
    // section 4 has the importance grid
    const answers = {
      must_have_feeling: "Fast and simple",
    };
    render(<Survey initialStep={4} initialAnswers={answers} initialName="Alex" />);
    const groups = screen.getAllByRole("radiogroup");
    // 10 items in the importance grid
    expect(groups.length).toBeGreaterThanOrEqual(10);
  });
});

// ─── Navigation ────────────────────────────────────────────────────────────────

describe("navigation", () => {
  it("Continue is disabled until required questions are answered", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    expect(screen.getByRole("button", { name: /Continue/i })).toBeDisabled();
  });

  it("Continue enables when all required questions are answered", () => {
    render(<Survey initialStep={1} initialAnswers={SECTION_1_ANSWERS} initialName="Alex" />);
    expect(screen.getByRole("button", { name: /Continue/i })).not.toBeDisabled();
  });

  it("Back button is not shown on section 1", () => {
    render(<Survey initialStep={1} initialAnswers={{}} initialName="Alex" />);
    expect(screen.queryByRole("button", { name: /Back/i })).not.toBeInTheDocument();
  });

  it("Back button appears on section 2+", () => {
    render(<Survey initialStep={2} initialAnswers={{}} initialName="Alex" />);
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });

  it("last section shows Submit button", () => {
    render(<Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />);
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });
});

// ─── Submit handler ────────────────────────────────────────────────────────────

describe("submit handler", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_APPS_SCRIPT_URL", APPS_SCRIPT_URL);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("calls fetch with the correct URL and method on submit", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        APPS_SCRIPT_URL,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "text/plain" },
        })
      );
    });
  });

  it("sends name and answers in the request body", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.name).toBe("Alex");
      expect(body.answers).toMatchObject(LAST_SECTION_ANSWERS);
      expect(body.submittedAt).toBeTruthy();
    });
  });

  it("shows thank-you screen on successful submission", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/You're done/i)).toBeInTheDocument();
    });
  });

  it("shows error message when fetch throws a network error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(/Something went wrong/i);
    });
  });

  it("shows error message when server returns non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    let resolve;
    global.fetch.mockReturnValueOnce(
      new Promise((r) => { resolve = r; })
    );

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(screen.getByRole("button", { name: /Submitting/i })).toBeDisabled();

    resolve({ ok: true, json: async () => ({ success: true }) });
    await waitFor(() => {
      expect(screen.getByText(/You're done/i)).toBeInTheDocument();
    });
  });

  it("skips fetch and shows thank-you when VITE_APPS_SCRIPT_URL is not set", async () => {
    vi.stubEnv("VITE_APPS_SCRIPT_URL", "");

    render(
      <Survey initialStep={5} initialAnswers={LAST_SECTION_ANSWERS} initialName="Alex" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/You're done/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
