(() => {
	var ex = !1;
	var d = document;
	var id = 'getElementById';
	var iH = 'innerHTML';
	ChilledWindows = (cb) => {
		if (!ex) {
			ex = !0;

			html2canvas(document.body).then((cvs) => {
				d['body'].insertAdjacentHTML(
					'beforeend',
					`
					<div id="chilledWindows">
					<style>
						#chilledWindows {
							width: 100vw;
							height: 100vh;
							position: fixed;
							top: 0;
							left: 0;
							background-color: transparent;
							z-index: 69696969;
						}
						#chilledWindows #big.chilledImage {
							position: relative;
							width: 100vw;
							height: 100vh;
						}
						#chilledWindows #split1.chilledImage,
						#chilledWindows #split2.chilledImage {
							width: 50vw;
							height: 100vh;
							position: absolute;
						}
						#chilledWindows #split {
							width: 100vw;
							height: 100vh;
							position: relative;
						}
						#chilledWindows #split1 {
							top: 0;
							left: 0;
						}
						#chilledWindows #split2 {
							top: 0;
							right: 0;
						}</style
					><style id="imageCache"></style><audio id="muziku"></audio>
					<div id="big" class="chilledImage"></div>
					<div id="split">
						<div id="split1" class="chilledImage"></div>
						<div id="split2" class="chilledImage"></div>
					</div>
				</div>
					`
				);
				d[id]('imageCache')[
					iH
				] = `.chilledImage{background-image:url('${cvs.toDataURL()}')}`;

				ex = !1;
			});
			return 'loading...';
		} else {
			return 'already executed';
		}
	};
})();
