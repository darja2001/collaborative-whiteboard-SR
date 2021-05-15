import io from 'socket.io-client';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList} from 'react-native';

class Database extends React.Component {

    state ={
        data:[]
      }
    
      fetchData= async()=>{
        const response = await fetch('http://localhost:5000/user');
        const users = await response.json();
        this.setState({data: users});
    
      }
    componentDidMount(){
      this.fetchData();
    }

    render() {
        return (
          <View >
           <Text>Welcome</Text>
           
           <FlatList
           data={this.state.data}
           keyExtractor={(item,index) => index.toString()}
           renderItem={({item}) =>
              
           <View style={{backgroundColor:'#abc123',padding:10,margin:10}}>
               <img src={item.picture} alt="cat"/>
              <Text style={{color:'#fff', fontWeight:'bold'}}>{item.title_picture}</Text>
              
             </View>
    
           }
           
           />
          </View>
        );
      }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
  });
  
export default Database