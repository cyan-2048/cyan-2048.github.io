const fs = require("fs");
let files = [];
for (let i = 0; i < 18; i++) {
	files.push("(" + (i + 1) + ").png");
}

console.log(files);

files.forEach((a, i) => {
	fs.rename("./" + a, "./" + (i + 1) + ".png", function (err) {
		if (err) console.log("ERROR: " + err);
	});
});
