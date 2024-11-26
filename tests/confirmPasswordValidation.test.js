const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Simulate DOM and import script
const js = fs.readFileSync(path.resolve(__dirname, '../public/js/passwordValidation.js'), 'utf8');

const html = `<h1>Register</h1>
              <form action="/register" method="POST" onsubmit="return validatePasswords()">
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" required>
                  <br>
                  <label for="password">Password:</label>
                  <input type="password" id="password" name="password" required>
                  <br>
                  <label for="confirm-password">Confirm Password:</label>
                  <input type="password" id="confirm-password" required>
                  <br>
                  <span id="password-error" class="error"></span>
                  <br>
                  <button type="submit">Register</button>
              </form>`;



describe('Password Validation', () => {
    let document, window;
  
    beforeEach(() => {
      // Create a JSDOM environment and load the necessary HTML and script
      const dom = new JSDOM(html, { runScripts: "dangerously" });
  
      document = dom.window.document;
      window = dom.window;
  
      // Load your passwordValidation.js script into the window object.
      const script = document.createElement('script');
      script.textContent = js;
      document.head.appendChild(script);
    });
  
    it('should show an error if passwords do not match', () => {
      document.getElementById('password').value = 'password123';
      document.getElementById('confirm-password').value = 'password321';
  
      const isValid = window.validatePasswords();  // Now `validatePasswords` will work
  
      expect(isValid).toBe(false);
      expect(document.getElementById('password-error').textContent).toBe('Passwords do not match!');
    });
  
    it('should clear the error and allow submission if passwords match', () => {
      document.getElementById('password').value = 'password123';
      document.getElementById('confirm-password').value = 'password123';
  
      const isValid = window.validatePasswords();
  
      expect(isValid).toBe(true);
      expect(document.getElementById('password-error').textContent).toBe('');
    });
  });