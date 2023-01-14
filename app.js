const express=require('express');
const app=express();
const morgan=require('morgan');
const mongoose=require('mongoose');
const Blog=require('./models/blog');
const { render } = require('ejs');

app.set('view engine','ejs');

const uri="mongodb+srv://joel:yawhey123@nodetuts.uhp9zzf.mongodb.net/nodetuts?retryWrites=true&w=majority"

async function connect(){
    try{
        await mongoose.connect(uri);
        app.listen(3000);
    }catch(error){
        console.error(error);
    }
}
mongoose.set('strictQuery', false)
connect();

////middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));


///routes
app.get('/',(req,res)=>{
res.redirect('/blogs')
})



app.get('/blogs/create',(req,res)=>{
    res.render('create',{title:'Create new Blog'});
});


app.get('/about',(req,res)=>{
   
    res.render('about',{title:'About'});
});


//redirects
app.get('/blogs',(req,res)=>{
Blog.find().sort({createdAt:-1})
.then((result)=>{
    res.render('index',{title:'All Blogs',blogs:result});
})
.catch((err)=>{
    console.log(err);
})
})


///POST

app.post('/blogs',(req,res)=>{
    const blog=new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs');
    })
    .catch((err)=>{
        console.log(err);
    })
});


///get id and redirects to other pages


app.get('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details',{blog:result,title:'Blog Details'})
    })
    .catch((err)=>{
        console.log(err);
    })
})



///delete buy 

app.delete('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.use((req,res)=>{
 

    res.status(404).render('404',{title:'404'});

});


