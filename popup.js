document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const strengthFeedback = document.getElementById("strength-feedback");
  const breachFeedback = document.getElementById("breach-feedback");

  // Function to check password strength
  function checkPasswordStrength(password) {
    const regex = {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>]/,
      length: /.{8,}/
    };

    const tests = Object.values(regex).map(r => r.test(password));
    const passedTests = tests.filter(Boolean).length;

    if (passedTests <= 2) return "Weak";
    if (passedTests === 3) return "Moderate";
    return "Strong";
  }

  // Simulated API breach checker
  async function checkBreach(password) {
    // Simulate a breach check with a delay (replace this with actual API logic)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0); // Simulate breach count
      }, 500);
    });
  }

  // Listen for input on the password field
  passwordInput.addEventListener("input", async () => {
    const password = passwordInput.value;

    // Update password strength dynamically
    const strength = checkPasswordStrength(password);
    strengthFeedback.textContent = `Strength: ${strength}`;

    // Check for breaches if password length is sufficient
    if (password.length >= 8) {
      const breached = await checkBreach(password);
      breachFeedback.textContent = breached > 0
        ? `Breached ${breached} times! Choose another password.`
        : "No breaches found.";
    } else {
      breachFeedback.textContent = "Password too short for breach check.";
    }
  });

  // Function to generate a strong password
  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Generate password button logic
  document.getElementById("generate-password").addEventListener("click", () => {
    const strongPassword = generatePassword();
    passwordInput.value = strongPassword;
    strengthFeedback.textContent = "Strength: Strong";
    breachFeedback.textContent = "No breaches found.";
  });

  // Local saving functionality
  document.getElementById("save-local").addEventListener("click", () => {
    const password = passwordInput.value;
    if (password) {
      chrome.storage.local.set({ savedPassword: password }, () => {
        alert("Password saved locally!");
      });
    } else {
      alert("No password to save!");
    }
  });

  // Cloud saving functionality (placeholder logic)
  document.getElementById("save-cloud").addEventListener("click", () => {
    const password = passwordInput.value;
    if (password) {
      alert("Cloud saving not implemented yet. Coming soon!");
    } else {
      alert("No password to save!");
    }
  });
});
