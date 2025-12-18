import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

// Test login
async function testLogin(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(`Login ${email}:`, response.status, data);
    return data.token;
  } catch (error) {
    console.error('Login error:', error.message);
  }
}

// Test tasks endpoint
async function testTasks(token) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Tasks:', response.status, data);
  } catch (error) {
    console.error('Tasks error:', error.message);
  }
}

// Test activities endpoint
async function testActivities(token) {
  try {
    const response = await fetch(`${BASE_URL}/activities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Activities:', response.status, data);
  } catch (error) {
    console.error('Activities error:', error.message);
  }
}

// Test creating a task (admin only)
async function testCreateTask(token) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Testing task creation',
        assignedTo: 2
      }),
    });
    const data = await response.json();
    console.log('Create Task:', response.status, data);
    return data.id;
  } catch (error) {
    console.error('Create Task error:', error.message);
  }
}

// Test updating a task
async function testUpdateTask(token, taskId) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'completed'
      }),
    });
    const data = await response.json();
    console.log('Update Task:', response.status, data);
  } catch (error) {
    console.error('Update Task error:', error.message);
  }
}

// Test deleting a task (admin only)
async function testDeleteTask(token, taskId) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Delete Task:', response.status, data);
  } catch (error) {
    console.error('Delete Task error:', error.message);
  }
}

async function main() {
  console.log('Testing API endpoints...');

  // Test admin login
  const adminToken = await testLogin('admin@example.com', 'adminpassword');
  if (adminToken) {
    console.log('\n--- Admin Operations ---');
    await testTasks(adminToken);
    await testActivities(adminToken);

    // Create a test task
    const taskId = await testCreateTask(adminToken);
    if (taskId) {
      // Update the task
      await testUpdateTask(adminToken, taskId);
      // Delete the task
      await testDeleteTask(adminToken, taskId);
    }

    // Check activities after operations
    await testActivities(adminToken);
  }

  // Test user login
  const userToken = await testLogin('user@example.com', 'userpassword');
  if (userToken) {
    console.log('\n--- User Operations ---');
    await testTasks(userToken);

    // Try to create task as user (should fail)
    console.log('Testing user creating task (should fail):');
    await testCreateTask(userToken);

    // Try to delete task as user (should fail)
    console.log('Testing user deleting task (should fail):');
    await testDeleteTask(userToken, 1);
  }
}

main();