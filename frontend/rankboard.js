const get_records = async () => {
  const res = await fetch("/records");
  const data = await res.json();
  let i = 1;
  data.forEach((obj) => {
    const records = document.getElementById("wrapper");
    const info = document.createElement("div");
    info.style.fontSize = "20px";
    info.style.display = "flex";
    info.style.flexDirection = "row";
    info.style.justifyContent = "space-between";
    if (i == 1) {
      info.style.color = "rgb(255,215,0)";
      info.innerText = `🥇 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else if (i == 2) {
      info.style.color = "rgb(192, 192, 192)";
      info.innerText = `🥈 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else if (i == 3) {
      info.style.color = "rgb(205, 127, 50)";
      info.innerText = `🥉 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else info.innerText = `${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;

    records.appendChild(info);
    i++;
  });
};

get_records();
