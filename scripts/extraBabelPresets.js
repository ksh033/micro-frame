 const extraBabelPresets=(_context, opts) => {
   
   return  {
    overrides: [
        {
          test: filename =>{

            console.log("extraBabelPresets",filename)
           return   /\.js?$/.test(filename)
          },
          presets:[],
          plugins: [],
        },]
   }
}


module.exports = extraBabelPresets;