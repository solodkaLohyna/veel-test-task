"use client";

// Types
import { Task } from "@/modules/tasks/TasksRepository";

// Hooks
import { useEffect, useState } from "react";

// Repositories
import { tasksRepository } from "@/modules/tasks/TasksRepository";

// UI components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import {
  BookmarkPlus,
  CircleCheckBig,
  CircleX,
  Pencil,
  Trash2,
} from "lucide-react";

export const Main = () => {
  //   const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number>();
  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    tasksRepository.getAll().then((data) => setTasks(data));
  };

  const handleDeleteTask = (id: number) => {
    tasksRepository.delete(id).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const handelUpdateTask = (id: number, title: string) => {
    if (isEditing && currentTaskId === id) {
      const updatedTask: Task = {
        id,
        title: text,
        completed: tasks.find((task) => task.id === id)?.completed ?? false,
      };

      tasksRepository.update(id, updatedTask).then(() => {
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      });

      setIsEditing(false);
      setCurrentTaskId(undefined);
    } else {
      setIsEditing(true);
      setCurrentTaskId(id);
      setText(title);
    }
  };

  const handleConfirmTask = () => {
    setIsClicked(true);

    if (text === "" || text === null) {
      toast.error("Input cannot be empty!", {
        description: "Please, fill input to continue.",
        duration: 3000,
      });
      return;
    }

    const newTask: Task = {
      id: tasks.length + 1,
      title: text,
      completed: false,
    };

    tasksRepository.create(newTask).then((data) => {
      console.log(data);
      const newTasks = [
        ...tasks,
        {
          ...data,
          id: tasks.length + 1,
        },
      ];
      console.log(newTasks);

      setTasks(newTasks);
      setIsClicked(false);
      setText("");
    });
  };

  const handleCancelTask = () => {
    setIsClicked(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    taskId?: number
  ) => {
    if (e.key === "Enter") {
      if (taskId !== undefined) {
        handelUpdateTask(taskId, text);
      } else {
        handleConfirmTask();
      }
      //   if (text === "" || text === null) {
      //     toast.error("Input cannot be empty!", {
      //       description: "Please, fill input to continue.",
      //       duration: 3000,
      //     });
      //   }
    }
  };

  const mapTasks = tasks.map((task) => {
    return (
      <div
        key={task.id}
        className="flex justify-between items-center w-full shadow-md p-3 rounded-md"
      >
        {isEditing && currentTaskId === task.id ? (
          <Input
            className="w-1/2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, task.id)}
            autoFocus
          />
        ) : (
          <div className="flex items-center space-x-3">
            <Checkbox
              className="cursor-pointer"
              checked={task.completed}
              onCheckedChange={(checked) => {
                setTasks((prevTasks) =>
                  prevTasks.map((t) =>
                    t.id === task.id ? { ...t, completed: !!checked } : t
                  )
                );
              }}
            />
            <p
              className={`text-xl + ${
                task.completed ? "text-gray-400 line-through" : ""
              }`}
            >
              {task.title}
            </p>
          </div>
        )}

        <div className="flex space-x-3 items-center ">
          <Button
            size="icon"
            onClick={() => handelUpdateTask(task.id, task.title)}
          >
            {isEditing && task.id === currentTaskId ? (
              <CircleCheckBig />
            ) : (
              <Pencil />
            )}
          </Button>
          <Button
            size="icon"
            onClick={() => {
              toast("Are you sure you want to delete this task?", {
                description: "This action cannot be undone.",
                action: {
                  label: "Delete",
                  onClick: () => {
                    handleDeleteTask(task.id);
                  },
                },
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    );
  });

  return (
    <div className="mt-2 container mx-auto bg-white rounded-xl">
      <div className="overflow-auto h-[90vh] flex justify-between gap-3 flex-col shadow-md rounded-xl p-5 z-0 ">
        {mapTasks}
        <hr className="border-gray-200 border-[1.5px] border-dashed" />
        {isClicked ? (
          <div className="flex justify-between">
            <Input
              className="w-1/2 p-3"
              value={text}
              onChange={(e) => {
                if (e.target.value.startsWith(" ")) {
                  return;
                }
                setText(e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e)}
              autoFocus
            />
            <div className="flex space-x-3 items-center">
              <Button size="icon" onClick={handleConfirmTask}>
                <CircleCheckBig />
              </Button>
              <Button size="icon" onClick={handleCancelTask}>
                <CircleX size={48} />
              </Button>
            </div>
          </div>
        ) : (
          <Button className="shadow-md h-12" onClick={() => setIsClicked(true)}>
            <BookmarkPlus className="shrink-0 size-8"/>
          </Button>
        )}
      </div>
    </div>
  );
};
