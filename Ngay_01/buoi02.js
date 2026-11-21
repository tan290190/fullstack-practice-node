const getPendingTasks = async (userId) => {
  try {
    console.log(`Đang gửi Request lấy danh sách công việc về ID: ${userId}`);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?userId=${userId}`,
    );

    const data = await response.json();

    const pendingTasks = data.filter(
      (task) => task.userId === 1 && task.completed === false,
    );

    const message = pendingTasks.map((task) => `Công việc: ${task.title}`);

    console.log(message);

    console.log(`Tổng số công việc chưa hoàn thành: ${pendingTasks.length}`);
  } catch (error) {
    console.log("không có công việc chưa hoàn thành ", error.message);
  }
};
getPendingTasks(1);
