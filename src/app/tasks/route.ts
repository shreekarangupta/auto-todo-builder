import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch all tasks (GET)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Create a new task (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, priority } = body;

    if (!title || !priority) {
      return NextResponse.json({ error: "Title and priority are required" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: { title, priority, status: "pending" },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding task:", error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Delete a task (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
