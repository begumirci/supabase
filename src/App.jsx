
import { createClient } from '@supabase/supabase-js';
import './App.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import eye from './assets/eye.svg'


const url = 'https://uucqqjkknlytpqxhhtwd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y3Fxamtrbmx5dHBxeGhodHdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MzkzNzYwMSwiZXhwIjoyMDA5NTEzNjAxfQ.lwWdYJodSukSAqSrTvSzI_Ilpe4Un75JsFS-r9-YCWA';

const supabase = createClient(url, key);


export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  function handlePassword() {
    if (showPassword == false) {
      setShowPassword(true);
    }
    if (showPassword == true) {
      setShowPassword(false)
    }
  }
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })
    if (error) {
      alert('Böyle Bir Kullanıcı Bulunamadı');
      console.log(error);
    } else {
      alert('Başarıyla Giriş Yapıldı');
      navigate(-1);
    }
  }
  return (
    <div className='container'>
      <h1>Giriş Yap</h1>
      <form className='login-form' onSubmit={handleLogin}>
        <div className="input-element">
          <input type="email" name='email' required />
          <label>Email</label>
        </div>
        <div class="input-element">
          <input type={showPassword ? 'text' : 'password'} name='password' required />
          <label>Şifre</label>
          <img className='eye' src={eye} alt="" onClick={handlePassword} />
        </div>
        <div className='buttons'>
          <button className='btn'>Giriş Yap</button>
          <button className='btn' onClick={() => { navigate(-1) }}>Geri</button>
        </div>
      </form>

    </div>
  )
}

function SendPost({ user }) {
  const [post, setPost] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemId, setItemId] = useState('');

  useEffect(() => {
    getPost();
  }, [post])

  async function getPost() {
    let { data, error } = await supabase
      .from('posts')
      .select('*');
    if (error) {
      console.log(error);
    } else {
      setPost(data);
    }

  }
  function SayYes() {
    deleteItem(itemId);
    setShowModal(false);
  }

  function openInform(itemId) {
    setShowModal(true);
    setItemId(itemId);
  }

  function SayNo() {
    setShowModal(false);
  }
  async function deleteItem(itemId) {

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', itemId)
    if (error) {
      console.log(error);
    } else {
      console.log('basarılı')
    }
  }


  async function handlePost(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const myPost = Object.fromEntries(formData);
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { caption: myPost.post, username: user.user_metadata.name },
      ])

    e.target.reset();
  }
  return (
    <div className='container'>
      {showModal ? <Inform SayNo={SayNo} SayYes={SayYes} /> : ''}
      <form onSubmit={handlePost} className='login-form'>
        <div className="input-element input-post">
          <input type="text" name='post' required />
          <label>Post girin</label>
          <button className='btn'>Gönder</button>
        </div>
      </form>

      <div className='posts'>
        {post.map(x => (
          <div key={x.id} className='post'>
            <div className='post-user'>
              <strong>{x.username}</strong>
              {x.caption}
            </div>
            <button className="del-button" onClick={() => openInform(x.id)}>
              <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
            </button>

          </div>
        ))}
      </div>

    </div>
  )
}

async function Logout() {
  const { error } = await supabase.auth.signOut();
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  function handlePassword() {
    if (showPassword == false) {
      setShowPassword(true);
    }
    if (showPassword == true) {
      setShowPassword(false)
    }
  }
  const navigate = useNavigate();

  async function handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newuser = Object.fromEntries(formData);



    const { data:imgData, error: imgError } = await supabase.storage
      .from('posts')
      .upload(newuser.image.name, newuser.image)

     

    const { data, error } = await supabase.auth.signUp({
      email: newuser.email,
      password: newuser.password,
      options: {
        data: {
          name: newuser.name,
          image: newuser.image.name
        }
      }
    })

    if (error) {
      console.log('Kayıt Hatası', error);
    } else {
      alert('Başarıyla Kayıt Oldunuz !');
      navigate(-1);
    }
  }

  return (
    <div className='container'>
      <h1>Üye Ol</h1>
      <form className='login-form' onSubmit={handleForm}>
        <div className="input-element">
          <input type="text" name='name' required />
          <label>Ad</label>
        </div>
        <div className="input-element">
          <input type="email" name='email' required />
          <label>Email</label>
        </div>
        <div className="input-element relative">
          <input type={showPassword ? 'text' : 'password'} name='password' required />
          <label>Password</label>
          <img className='eye' src={eye} alt="" onClick={handlePassword} />
        </div>
        <div className="input-element">
          <input type="file" name='image' required />
        </div>
        <div className='buttons'>
          <button className='btn'>Üye Ol</button>
          <button className='btn' type='button' onClick={() => { navigate(-1) }}>Geri</button>
        </div>
      </form>

    </div>

  )
}

export function User() {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);

  const [publicUrl, setPublicUrl] = useState();
  
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
      setVisible(true);
      getImage();
    })

  }, [user])


  async function getImage() {
   
    const { data, error } = await supabase
      .storage
      .from('posts')
      .getPublicUrl(user.user_metadata.image)
      setPublicUrl(data.publicUrl);
  }


  return (
    <div className='anasayfa'>
      <div className={visible ? 'block' : 'none'} >
        {user ?
          <>
            <div className='header'>
              <img src={publicUrl} alt="" />
              <h1>{user.user_metadata?.name}</h1> <button className='btn logout-btn' onClick={() => Logout()}>Çık</button>
            </div>
            <SendPost user={user} />
          </> :
          <>
            <div className='buttons'>
              <Link to='/register'><button className='btn'>Üye Ol</button></Link>
              <Link to='/login'><button className='btn'>Giriş Yap</button></Link>
            </div>
          </>
        }

      </div>


    </div>
  )
}


function Inform({ SayYes, SayNo }) {

  return (

    <div className='inform'>
      <div className='inform-content'>
        <h1>Bu veriyi silmek istediğinize emin misiniz ?</h1>
        <div className='info-btns'>
          <button className='btn' onClick={SayYes}>Evet</button>
          <button className='btn' onClick={SayNo}>Hayır</button>
        </div>       
      </div>
    </div>
  )
}



function App() {


  return (
    <>

      <div>
        <Outlet />
      </div>

    </>
  )
}

export default App
