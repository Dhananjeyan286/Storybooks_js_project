const moment=require("moment")//used to format date

module.exports={
    formatdate:(date,format)=>{
        return moment(date).format(format)
    },
    truncate:(str)=>{
        const len=20
        if(str.length>len)
        {
            newstr=str.substr(0,len)
            newstr=newstr+"..."
            return newstr
        }
        return str
    },
    striptags:(str)=>{
        return str.replace(/<(?:.|\n)*?>/gm,"")
    },
    editicon: function (storyUser, loggedUser, storyId, floating) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {//in public stories if the stories of the logged in user exist then this edit icon will show up else if there are no public stories of the logged in user then the edit icon will not show up
            if (floating) {//floating means the button is set to float on the card class tht is it appears on the rhs top of the card 
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            }
            else//if no floating means it appears on lhs top of the card
            {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } 
        else {
            return ''
        }
    },
    select:(status)=>{
        if(status=="public")
        {
            return `<option value="public" selected>Public</option>
            <option value="private">Private</option>`
        }
        else
        {
            return `<option value="public" >Public</option>
            <option value="private" selected>Private</option>`
        }
    },
    merror:(errors)=>{
        let ans=``
        if(errors)
        {
            errors.forEach((error)=>{
                ans=ans+`<div class="alert">
                <strong>Warning!</strong> ${error.msg}<br><br>
            </div>`
            })
        return ans    
        }
    }
}