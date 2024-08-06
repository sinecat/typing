export const getRandomData = (dataArr: any[], num: number) => {
    let result = [];
    const shuffled = dataArr.slice().sort(() => 0.5 - Math.random());
    result = shuffled.slice(0, num).map((item) => ({
        text: item.text,
        value: item.value + ' '
    }))

    return {
        data: result,
        strLength: result.reduce((acc, cur) => acc + cur.value.length, 0)
    }
}