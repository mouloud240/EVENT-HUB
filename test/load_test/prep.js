import fs from 'fs';

const baseUser = {
  name: 'Dev User',
  email: 'dev@user.com',
  password: 'Password@123',
};

const users = [];

for (let i = 1; i <= 1000; i++) {
  users.push({
    name: `${baseUser.name} ${i}`,
    email: `user${i}@example.com`,
    password: `${baseUser.password}${i}`, // Append number to password
  });
}

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
console.log('Generated 1000 users in users.json');
