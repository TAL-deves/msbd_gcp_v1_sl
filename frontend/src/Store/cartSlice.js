const { createSlice } = require("@reduxjs/toolkit")



const cartSlice= createSlice({
  name:"cart",
  initialState: localStorage.getItem("course")!==null && localStorage.getItem("course").length!==0?JSON.parse(localStorage.getItem("course")):[],

   reducers:{
    add(state, action){
      
      if(action?.payload?.fullObject?.courseID!==null){
        let findObj =state.find((obj)=>{return action?.payload?.fullObject?.courseID=== obj.fullObject?.courseID})
        

        if(findObj===null || findObj===undefined){
          state.push(action.payload)
        }
      }
       
    },
    remove(state, action){
      
      
        
      return state.filter((item)=>item.id !== action.payload.id)
      //   return state.filter((item)=>item.courseID !== action.payload)

     },
    // selectedCourse(state, action){

    // }
   }

})

export const {add, remove, check} =cartSlice.actions;
export default cartSlice.reducer;