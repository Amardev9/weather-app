const API_KEY = 'd555473dbb584b48ad06bc5e7ac749ed';

const input = document.getElementById('input');
const searchButton = document.getElementById('input-btn')
let userInput;

let weatherData;

const cityName = document.querySelector('.city-name');
const temp = document.querySelector('.temp');
const desc = document.querySelector('.desc');
const wind = document.querySelector('.wind');
const pres = document.querySelector('.pres');
const hum = document.querySelector('.hum');
const weatherImg = document.querySelector('.weather-icon');
const weatherInfoContainer = document.querySelector('.weather-info');
const section = document.querySelector('.weather-section');
const FBtn = document.querySelector('.f-btn');
const FList = document.querySelector('.favorite-list');
const removeBtn = document.querySelector('.r-btn');
const BtnWrapper = document.querySelector('.btn-container');
const errorMessage = document.querySelector('.error-message');

isTempC = true;

let oldCon;
let newCon;
let id = 0;





if(localStorage.favorite == undefined){
    localStorage.setItem('favorite',JSON.stringify([]))
}
let favorite = JSON.parse(localStorage.favorite)

// Get weather data 

async function  getWeatherData(userInput){

    try{
        const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${userInput}&key=${API_KEY}&days=7`);
        weatherData = await response.json();
        console.log(weatherData)
        cityName.textContent = weatherData.city_name;
        temp.textContent = weatherData.data[0].temp +'  '+ '°C';
        weatherImg.src =`/icons/${weatherData.data[0].weather.icon}.png`
        desc.textContent = weatherData.data[0].weather.description;
        wind.textContent = weatherData.data[0].wind_spd;
        hum.textContent = weatherData.data[0].rh;
        pres.textContent = weatherData.data[0].pop;
        weatherInfoContainer.classList.add('show-weather');
        BtnWrapper.classList.add('show-weather');

        const template = weekForecastTemplate(weatherData);
        section.appendChild(template)

        const con = document.querySelectorAll('.day-container')
        oldCon = con[0];
        oldCon.classList.add('border');

        con.forEach((el,index)=>{
            el.addEventListener('click',()=>{
                oldCon.classList.remove('border')
                el.classList.add('border')
                oldCon = el;
                
                
            })
        })

        

       

    }
    catch(error){
        console.log(error)
    }
}


// Get user input

searchButton.addEventListener('click',()=>{
    if(input.value != ''){

        userInput = input.value;
        getWeatherData(userInput)
        input.value = '';
        if(document.querySelector('.week-forecast') !== null){
            document.querySelector('.week-forecast').remove();
        }

    }else{
        errorMessage.classList.add('error-message-show')

        setTimeout(() => {
            errorMessage.classList.remove('error-message-show')
        }, 3000);
    }
    

    

})

document.addEventListener('keyup',(e)=>{
    e.preventDefault();
    if (e.key === "Enter") {
        searchButton.click()
    }
  
})


function getDayNames(dateString){
    const date = new Date(dateString)
    const dayNumber = date.getDay();
    let dayName;

    switch(dayNumber){

        case 0:
            dayName = 'Sunday';
        break;

        case 1:
            dayName = 'Monday';
        break;

        case 2:
            dayName = 'Tuesday';
        break;

        case 3:
            dayName = 'Wednesday';
        break;

        case 4: 
            dayName = 'Thursday';
        break;

        case 5:
            dayName = 'Friday';
        break;

        case 6:
            dayName = 'Saturday';
        break;

    }
    return dayName;
}


function weekForecastTemplate(weatherData){
    const template = document.createElement('div');
    template.setAttribute('class','week-forecast');
    weatherData.data.forEach((el,index) => {
        const container = document.createElement('div');
        container.setAttribute('class', 'day-container');
        container.setAttribute('data-id', index);

       


        const day = document.createElement('h3');
        day.setAttribute('data-id', index);
        day.setAttribute('class','day');

        const apiDateTime = el.datetime;
        const newDateTime = apiDateTime.substring(5, 10) + '-' + apiDateTime.substring(0,4)
        day.textContent = getDayNames(newDateTime)

        const icon = document.createElement('img');
        icon.setAttribute('class','icon-weather')
        icon.src  =`/icons/${el.weather.icon}.png`;
        icon.setAttribute('data-id', index)

        const dayTemp = document.createElement('h4');
        dayTemp.setAttribute('class','day-temp');
        dayTemp.textContent = el.temp +'  '+ '°C';
        dayTemp.setAttribute('data-id', index);





        
        container.appendChild(day);
        container.appendChild(icon);
        container.appendChild(dayTemp);
        template.appendChild(container);
        
    });
    return template;
}

document.addEventListener('click',(event)=>{
    if(event.target.dataset.id){
        id = event.target.dataset.id;

        cityName.textContent = weatherData.city_name;
        temp.textContent = weatherData.data[id].temp +'  '+ '°C';
        weatherImg.src =`/icons/${weatherData.data[id].weather.icon}.png`
        desc.textContent = weatherData.data[id].weather.description;
        wind.textContent = weatherData.data[id].wind_spd;
        hum.textContent = weatherData.data[id].rh;
        pres.textContent = weatherData.data[id].pop;

        


    }

    if(event.target.tagName.toLowerCase() === 'span'){
        
        getWeatherData(event.target.textContent)
        
        if(document.querySelector('.week-forecast') !== null){
            document.querySelector('.week-forecast').remove();
        }
    }

    

  
})


FBtn.addEventListener('click',(e)=>{
    if(favorite.indexOf(userInput)  == -1 ){
        favorite.push(userInput);
        const span = document.createElement('span');
        span.setAttribute('class','f-city-name')
        span.textContent = userInput;
        FList.appendChild(span)
    }
    
    localStorage.setItem("favorite",JSON.stringify(favorite))
    favorite = JSON.parse(localStorage.favorite)

})



document.addEventListener('DOMContentLoaded',()=>{
    console.log(favorite)
    favorite.forEach(city => {
        
        const span = document.createElement('span');
        span.setAttribute('class','f-city-name')
        span.textContent = city;

        FList.appendChild(span)
    

    })
})

removeBtn.addEventListener('click',()=>{
    localStorage.clear()
    document.querySelectorAll('.f-city-name').forEach(el=>{
        el.remove()
    })
    favorite = []

})




// Convert C to F
temp.addEventListener('click',(C)=>{
    
    if(temp.textContent.indexOf('C') > 0){
        C = parseFloat(temp.textContent.slice(0,4));
        let F = (C * 1.8 + 32).toFixed(2)
       
        
        temp.textContent = F +'  '+ '°F';
        isTempC = false;
    }
    
        

})



    


