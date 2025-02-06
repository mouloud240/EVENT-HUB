import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load user credentials from users.json
const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json'));
});

export const options = {
  vus: 50, // 50 virtual users
  duration: '1m', // Test runs for 1 minute
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)]; // Pick a random user

  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://localhost:3000/auth/login', payload, params);

  check(res, {
       'is status 201': (r) => r.status === 201,
  });

  sleep(1); // Simulate user waiting before sending another request
}
