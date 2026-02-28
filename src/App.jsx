import {useEffect,useState} from 'react';
import {api} from './api';

function App(){
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [notes,setNotes]=useState([]);

  const loadNotes = async()=>{
    const res = await api.get('/notes');
    setNotes(res.data);
  };

  useEffect(()=>{ loadNotes(); },[]);

  const createNote = async()=>{
    await api.post('/notes',{title,content});
    setTitle(''); setContent('');
    loadNotes();
  };

  const deleteNote = async(id)=>{
    await api.delete(`/notes/${id}`);
    loadNotes();
  };

  const exportNotes = ()=>{
    window.open('http://localhost:5000/api/export');
  };

  return(
    <div style={{padding:20}}>
      <h2>Notes App</h2>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <br/><br/>
      <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
      <br/><br/>
      <button onClick={createNote}>Create Note</button>
      <button onClick={exportNotes}>Export Notes</button>
      <hr/>
      {notes.map(n=> (
        <div key={n._id}>
          <h4>{n.title}</h4>
          <p>{n.content}</p>
          <button onClick={()=>deleteNote(n._id)}>Delete</button>
          <hr/>
        </div>
      ))}
    </div>
  );
}

export default App;