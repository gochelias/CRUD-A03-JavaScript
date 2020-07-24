const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');


let editStatus = false;
let id = '';
const addTask = (title, description) =>
    db.collection('tasks').doc().set(
    {
        title,
        description
    });


const getTasks = () => db.collection('tasks').get();
const getTask = (id) => db.collection('tasks').doc(id).get();
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);


window.addEventListener('DOMContentLoaded',
async (e) => 
{
    onGetTasks((querySnapshot) => 
    {
        taskContainer.innerHTML = "";
        querySnapshot.forEach((doc) => 
        {
            const task = doc.data();
            task.id = doc.id;
            taskContainer.innerHTML += 
            `
                <div class="card card-body mt-2 border-primary">
                    <h4> ${task.title} <br> </h4>
                    <p> ${task.description} </p>
                    <div>
                        <button class="btn btn-secondary mr-2 btn-edit" data-id="${task.id}"> Edit </button>
                        <button class="btn btn-danger btn-delete" data-id="${task.id}"> Delete </button>
                    </div>
                </div>
            `;
            
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => 
            {
                btn.addEventListener('click', 
                async (e) => 
                {
                    await deleteTask(e.target.dataset.id);
                });
            });
            

            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => 
            {
                btn.addEventListener('click', 
                async (e) => 
                {

                    /* console.log(e.target.dataset.id); */
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;
                    
                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.description;
                    taskForm['btn-task-form'].innerHTML = 'Update' 
                });
            });
        });
    });
});


taskForm.addEventListener("submit",
async (e) => 
{
    e.preventDefault();
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    
    if ( !editStatus )
    {
        await addTask(title.value, description.value);
    }
    else
    {
        await updateTask(id, 
            {
                title: title.value,
                description: description.value
            })
        
            editStatus = false;
            id = '';
            taskForm['btn-task-form'].innerHTML = 'Add';
    }

    taskForm.reset();
    title.focus();
});

