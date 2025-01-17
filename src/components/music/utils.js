const utils = {
    //循环限制
    limit(index, min, max) {
        // index -= 1
        index = parseInt(index)
        if (index < min) {
            index = max
        } else if (index > max) {
            index = min
        }
        return index
    },
    // 时间格式化位00：00
    formatTime(value) {
        let time = "";
        let s = value.split(":");
        let i = 0;
        for (; i < s.length - 1; i++) {
            time += s[i].length == 1 ? "0" + s[i] : s[i];
            time += ":";
        }
        time += s[i].length == 1 ? "0" + s[i] : s[i];
        return time;
    },
    // 把毫秒变成时分秒
    transTime(value) {
        let time = "";
        let h = parseInt(value / 3600);
        value %= 3600;
        let m = parseInt(value / 60);
        let s = parseInt(value % 60);
        if (h > 0) {
            time = this.formatTime(h + ":" + m + ":" + s);
        } else {
            time = this.formatTime(m + ":" + s);
        }
        return time;
    },
    //随机列表
    randomOrder(length) {
        function shuffle(arr) {
            for (let i = arr.length - 1; i >= 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                const itemAtIndex = arr[randomIndex];
                arr[randomIndex] = arr[i];
                arr[i] = itemAtIndex;
            }
            return arr;
        }
        return shuffle(
            [...Array(length)].map(function(item, i) {
                return i;
            })
        );
    },
    getScroll(target, top) {
        if (typeof window === 'undefined') {
            return 0;
        }

        const prop = top ? 'pageYOffset' : 'pageXOffset';
        const method = top ? 'scrollTop' : 'scrollLeft';
        const isWindow = target === window;

        let ret = isWindow ? target[prop] : target[method];
        // ie6,7,8 standard mode
        if (isWindow && typeof ret !== 'number') {
            ret = window.document.documentElement[method];
        }

        return ret;
    },
    easeInOutCubic(t, b, c, d) {
        const cc = c - b;
        t /= d / 2;
        if (t < 1) {
            return (cc / 2) * t * t * t + b;
        }
        return (cc / 2) * ((t -= 2) * t * t + 2) + b;
    },
    scrollTo(y, options) {
        const { getContainer = () => window, callback, duration = 450 } = options
        const container = getContainer();
        const scrollTop = this.getScroll(container, true);
        const startTime = Date.now();
        const frameFunc = () => {
            const timestamp = Date.now();
            const time = timestamp - startTime;
            const nextScrollTop = this.easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
            if (container === window) {
                window.scrollTo(window.pageXOffset, nextScrollTop);
            } else {
                container.scrollTop = nextScrollTop;
            }
            if (time < duration) {
                requestAnimationFrame(frameFunc);
            } else if (typeof callback === 'function') {
                callback();
            }
        };
        requestAnimationFrame(frameFunc);

    },
    /**
     * Parse lrc, suppose multiple time tag
     *
     * @param {String} lrc_s - Format:
     * [mm:ss]lyric
     * [mm:ss.xx]lyric
     * [mm:ss.xxx]lyric
     * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
     * [mm:ss.xx]<mm:ss.xx>lyric
     *
     * @return {String} [[time, text], [time, text], [time, text], ...]
     */
    parse(lrc_s) {
        if (lrc_s) {
            lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + '\n[');
            const lyric = lrc_s.split('\n');
            let lrc = [];
            const lyricLen = lyric.length;
            for (let i = 0; i < lyricLen; i++) {
                // match lrc time
                const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
                // match lrc text
                const lrcText = lyric[i]
                    .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                    .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                    .replace(/^\s+|\s+$/g, '');

                if (lrcTimes) {
                    // handle multiple time tag
                    const timeLen = lrcTimes.length;
                    for (let j = 0; j < timeLen; j++) {
                        const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                        const min2sec = oneTime[1] * 60;
                        const sec2sec = parseInt(oneTime[2]);
                        const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
                        const lrcTime = min2sec + sec2sec + msec2sec;
                        lrc.push([lrcTime, lrcText]);
                    }
                }
            }
            // sort by time
            lrc = lrc.filter((item) => item[1]);
            lrc.sort((a, b) => a[0] - b[0]);
            return lrc;
        } else {
            return [];
        }
    }
}
export default utils