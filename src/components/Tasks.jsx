import React, { useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';

const FORMAT = 'dd/MM/yyyy';
const AddTask = ({ collapse, onAddTask }) => {
    const [task, setTask] = useState('');
    const [date, setDate] = useState(null);


    function formatDate(date, format, locale) {
        return dateFnsFormat(date, format, { locale });
    }
    return (
        <div className='add-task-dialog'>
            <input value={task} onChange={(event) => setTask(event.target.value)} />
            <div className='add-task-actions-container'>
                <div className='btns-container'>
                    <button className='add-btn'
                        disabled={!task}
                        onClick={() => {
                            onAddTask(task, date);
                            collapse();
                            setTask('');
                        }}
                    >Add Task</button>
                    <button className='cancel-btn'
                        onClick={() => {
                            collapse();
                            setTask('');
                        }}
                    >Cancel</button>
                </div>
                <div className='icon-container'>
                    <span >Complete Before : </span>
                    <DayPickerInput
                        onDayChange={(day) => setDate(new Date(day))}
                        placeholder={dateFnsFormat(new Date(), FORMAT)}
                        formatDate={formatDate}
                        format={FORMAT}
                        dayPickerProps={{
                            modifiers: {
                                disabled: [{ before: new Date() }]
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

const TaskItems = ({ selectedTab, task }) => {
    let tasktoRender = [...task];
    if (selectedTab === 'NEXT_7') {
        tasktoRender = tasktoRender.filter(
            (task) =>
                isAfter(task.date, new Date()) &&
                isBefore(task.date, addDays(new Date(), 7))
        )
    }
    if (selectedTab === 'TODAY') {
        tasktoRender = tasktoRender.filter(
            (task) => isToday(task.date)
        )
    }
    return (
        <div className='task-item-container'>
            {tasktoRender.map(
                (task) => (
                    <div className='task-items'>
                        <p>{task.text}</p>
                        <p>{dateFnsFormat(new Date(task.date), FORMAT)}{' '}</p>
                    </div>
                )
            )}
        </div>
    )



}

const Tasks = ({ selectedTab }) => {
    const [showAddTask, setshowAddTask] = useState(false);
    const [task, setTask] = useState([]);
    const addTask = (text, date) => {
        const newTaskItem = { text, date: date || new Date() }
        setTask((prevState) => [...prevState, newTaskItem]);
    }
    const TASKS_HEADER_MAPPING = {
        INBOX: 'Inbox',
        TODAY: 'Today',
        NEXT_7: 'Upcoming Week'
    };
    return (
        <div className='tasks'>
            <h1>{TASKS_HEADER_MAPPING[selectedTab]}</h1>
            {selectedTab === 'INBOX' ? <div className='add-task-btn' onClick={() => setshowAddTask((prevState) => !prevState)}>
                <span className='plus'>+</span>
                <span className='add-task-text'>Add Task</span>
            </div> : null}
            {showAddTask &&
                <AddTask
                    onAddTask={addTask}
                    collapse={() => setshowAddTask(false)}
                />
            }

            {task.length > 0 ?
                <TaskItems selectedTab={selectedTab} task={task} />
                : <p>No Tasks Yet!</p>}
        </div>
    )
}

export default Tasks;
