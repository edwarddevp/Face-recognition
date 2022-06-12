import React, { Component } from "react";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import "./App.css"; 


 
const particlesOptions = {
    "particles": {
        "number": {
            "value": 100
        },
        "size": {
            "value": 3
        }
    }
};

const initialState = {
  input: '',
  imageUrl:'',
  facesFrames:[],
  route:'signin',
  isSignin:false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) =>{
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
      }  
    })
  }

  calculateFaceLocations = (data) =>{
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    })
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () =>{

    this.setState({imageUrl:this.state.input})

    fetch('http://localhost:3000/imageurl',{ 
      method: 'post',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
          input:this.state.input,
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
              id:this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)
      }
      this.setState({facesFrames:this.calculateFaceLocations(response)})
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route==='signout'){
      this.setState(initialState)
    }else if (route==='home'){
      this.setState({isSignin:true})
    }
    this.setState({route})

  }

  render() {
    const { isSignin, facesFrames, imageUrl, route} = this.state;
    return (
      <div className="App">
        <Particles className='particles' 
        params={particlesOptions} />
        <Navigation 
          onRouteChange={this.onRouteChange}
          isSignin={isSignin} />
        {route === 'home'
            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                  />
                <FaceRecognition facesFrames={facesFrames} imageUrl={imageUrl}/>
              </div>
            : (
                route === 'signin'
                ? <Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
                : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
              )
        }
      </div>
    );
  }
}

export default App;
