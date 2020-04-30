(() => {

    class MoodleSessionManager {
        constructor(url) {
            this.url = url;
        }

        getDateMs(days) {
            return Date.now() + 1000 * 60 * 60 * 24 * days;
        }

        async getCookieByName(name) {
            return await browser.cookies.get({
                name,
                url: this.url,
            });
        }

        async removeCookieByName(name) {
             await browser.cookies.remove({
                name,
                url: this.url
            });
        }

        async extend(days) {
            try {
                console.log("Fetching cookies")
                const test = await browser.cookies.getAll({
                    name,
                    url: this.url,
                });

                console.log(test);
                const cookie = await this.getCookieByName("MoodleSession");

                if (!cookie) {
                    alert("You have to login into moodle first.");
                    return false;
                }

                console.log(cookie);
                await this.removeCookieByName("MoodleSession");

                /* For Debugging purposes ... */
                //await new Promise((res, rej) => setTimeout(() => res(), 5000));
        
                const newDetails = {
                    expirationDate: this.getDateMs(365) / 1000,
                    firstPartyDomain: cookie.firstPartyDomain,
                    httpOnly: false,
                    name: cookie.name,
                    path: cookie.path,
                    sameSite: cookie.sameSite,
                    secure: cookie.secure,
                    storeId: cookie.storeId,
                    url: this.url,
                    value: cookie.value
                };
        
                const newCookie = await browser.cookies.set(newDetails);
                console.info("Set modified cookie.");
                console.log(newCookie);
                return true;
            } catch (e) {
                console.error(e);
            }
        }
    }

    const sessionManager = new MoodleSessionManager("https://lms.fh-wedel.de/");
    
    document
        .querySelector(".action button")
        .addEventListener("click", async () => {
            const success = await sessionManager.extend(365);
            success && alert("Success! You're now logged in for 365 days.");
        });
})();

