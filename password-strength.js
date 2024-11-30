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