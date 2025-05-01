import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'src/app/users/userData.json');

// Helper function to read and parse JSON safely
async function readUserData() {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File does not exist; return empty array
      return [];
    } else {
      // Re-throw other errors
      throw err;
    }
  }
}

export const addUser = async (email, password) => {
  const data = await readUserData();
  data.push({email, password});
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const findUser = async (email, password) => {
  const data = await readUserData();
  return data.find((user) => user.email === email && password === password);
};


export const validateToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded
}