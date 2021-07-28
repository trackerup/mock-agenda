const Tasks = () => import('./ListTasks').then(m => m.default || m)
const Task = () => import('./ViewTask').then(m => m.default || m)
const CompletedTasks = () => import('./CompletedTasks').then(m => m.default || m)
const Taskmap = () => import('@/pages/tasks/Taskmap').then(m => m.default || m)
const TasksProblem = () => import('./TaskProblem').then(m => m.default || m)
const FormPage = () => import('./form/FormPage').then(m => m.default || m)
const FutureTasks = () => import('./FutureTasks').then(m => m.default || m)
const Occurrence = () => import('./Occurrence').then(m => m.default || m)

export default [
  {
    path: '/tasks',
    name: 'tasks.index',
    component: Tasks
  },
  {
    path: '/task/:id',
    name: 'tasks.task',
    component: Task
  },
  {
    path: '/completedTasks',
    name: 'tasks.completed',
    component: CompletedTasks
  },
  {
    path: '/taskmap',
    name: 'tasks.taskmap',
    component: Taskmap
  },
  {
    path: '/task/:id/form/:idForm',
    name: 'task.form.form',
    component: FormPage
  },
  {
    path: '/task/:id/form',
    name: 'task.form',
    component: FormPage
  },
  {
    path: '/taskProblem/:id',
    name: 'task.problem',
    component: TasksProblem
  },
  {
    path: '/futureTasks',
    name: 'task.future',
    component: FutureTasks
  },
  {
    path: '/occurrence',
    name: 'occurrence',
    component: Occurrence
  }
]
