import  { useState, useEffect } from 'react';
import { Check, Plus, X, Edit, Clock } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
}

const TaskTracker = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('e-time-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('e-time-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        timestamp: Date.now()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editingTask && editText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTask ? { ...task, text: editText } : task
      ));
      setEditingTask(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
           {/* Task Tracker Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-10 bg-dark-tertiary hover:bg-gray-700 px-4 py-2 rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        <Clock size={20} className="text-accent-primary mr-2" />
        <span className="text-white text-sm font-medium">Tasks</span>
      </button>
 

      {/* Task Tracker Panel */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-dark-secondary rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-dark-tertiary">
              <h3 className="text-lg font-semibold">Task Tracker</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex p-4 border-b border-dark-tertiary">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-l"
              />
              <button
                onClick={addTask}
                className="bg-accent-primary hover:bg-accent-secondary px-4 py-2 rounded-r flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tasks yet. Add some tasks to track your work!
                </div>
              ) : (
                <ul className="space-y-2">
                  {tasks.map(task => (
                    <li 
                      key={task.id} 
                      className={`bg-dark-tertiary rounded p-3 relative ${
                        task.completed ? 'opacity-70' : ''
                      }`}
                    >
                      {editingTask === task.id ? (
                        <div className="flex">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            className="flex-1 px-3 py-1 bg-dark-primary border border-gray-700 rounded"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="ml-2 bg-accent-primary hover:bg-accent-secondary p-1 rounded"
                          >
                            <Check size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <button
                            onClick={() => toggleComplete(task.id)}
                            className={`shrink-0 w-5 h-5 mr-3 rounded-sm border ${
                              task.completed ? 'bg-accent-primary border-accent-primary' : 'border-gray-500'
                            } flex items-center justify-center`}
                          >
                            {task.completed && <Check size={16} className="text-white" />}
                          </button>
                          <div className="flex-1 overflow-hidden">
                            <p className={`mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                              {task.text}
                            </p>
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock size={12} className="mr-1" />
                              {formatTimestamp(task.timestamp)}
                            </div>
                          </div>
                          <div className="flex ml-2">
                            <button
                              onClick={() => startEditing(task)}
                              className="text-gray-400 hover:text-white p-1"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Delete"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskTracker;
 