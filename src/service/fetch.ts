const Fetch = (url: string, options: any = {}) => {
  url = `/api${url}`;
  const isFile = options.body instanceof FormData;
  options.headers = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

  if (options.body) {
    options.body = isFile ? options.body : JSON.stringify(options.body);
  }

  return fetch(url, options).then(function (res) {
    return res.json();
  });
};

const Service: any = {
  Login(userName: string, password: string) {
    return Fetch(`/login?username=${userName}&password=${password}`);
  },

  Register(userName: string, password: string) {
    return Fetch('/register', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    });
  },

  AdminLogin(userName: string, password: string) {
    return Fetch('/admin', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    });
  },

  addArt(tid: number, uid: number, title: string, content: string) {
    return Fetch('/art/add', {
      method: 'POST',
      body: {
        tid,
        uid,
        title,
        content,
      },
    });
  },

  deleteArt(aid: number) {
    return Fetch(`/art/delete/${aid}`, {
      method: "DELETE"
    });
  },

  getArtById(aid: number) {
    return Fetch(`/art/search/${aid}`);
  },

  LinkArt(aid: number) {
    return Fetch(`art/like/${aid}`, {
      method: 'PUT',
    });
  },

  getListByTag(tid: number) {
    return Fetch(`/art/list_tag_time/${tid}`);
  },

  getAllList() {
    return Fetch(`/art/list_all`);
  },

  getListByuser(uid: number) {
    return Fetch(`/art/list_user/${uid}`);
  },

  SearchList(text: string) {
    return Fetch(`/search?text=${text}`);
  },

  upload(file: any) {
    return Fetch('/upload', {
      method: 'POST',
      body: file,
    });
  },

  getUser(uid: number){
    return Fetch(`/user/search/${uid}`)
  },

  uploadImg(file: any){
    return Fetch(`/user/upload_profile?uid=${file.uid}&photo=${file.photo}`, {
      method:"PUT",
    })
  },

  addC(uid: string, aid: string) {
    return Fetch(`/favor/add/${uid}/${aid}`, {
      method: 'POST'
    })
  },

  getUserC(uid: string){
    return Fetch(`/favor/list_user/${uid}`)
  },
  
  deleteC(uid: string, aid: string){
    return Fetch(`/favor/delete/${uid}/${aid}`)
  }
};

export default Service;
