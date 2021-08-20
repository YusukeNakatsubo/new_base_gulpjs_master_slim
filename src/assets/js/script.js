let date = new Date();
// let element = document.getElementById('time')

const getTime = (date) => {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}
//returnの最初のdateをわざとdataと間違えて記述してみました。
// element.innerHTML = getTime(date)
console.log(getTime(date))