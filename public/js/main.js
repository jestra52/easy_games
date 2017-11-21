var APIFEATUREDURL = 'https://api.cebroker.com/v2/featuredCoursesProfession?profession=36';
var APICOURSESRURL = 'https://api.cebroker.com/v2/search/courses/?expand=totalItems&pageIndex=1&pageSize=18&sortField=RELEVANCE&profession=36&courseType=CD_ANYTIME&sortShufflingSeed=27;'
var accountId = '85b16cac-e1f7-4a19-ac89-484640bdc306';
var apiKey = 'b3089636651ea30ee2da460a4';
var accessKey = md5(accountId + apiKey);

new Vue({
    el: '#container',
    data: {
        featuredCourses: [],
        courses: [],
        totalItems: 0,
        items: [],
        name: [],
        image: [],
        link: [],
        price: []

    },
    created: function () {
        this.addFeaturedCourses();
        this.addCourse();
        this.extractorG2A();
    },
    methods: {
        extractorG2A: function () {
            request({
                uri : 'https://api.dexi.io/executions/33e98066-4182-485c-89d2-194fcb12fe0e/result',
                method: 'GET',
                headers: {
                    'X-DexiIO-Access': accessKey,
                    'X-DexiIO-Account': accountId,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'none',
                    'Host': 'localhost',
                    'User-Agent': 'YourApp/1.0'
                }
            },
            function (err, response) {
                if (!err) {
                    console.log(response);
                }
            });
        },

        addCourse: function () {
            axios.get(APICOURSESRURL).then((res) => {
                var items      = res.data.items;
                var totalItems = res.data.totalItems;
                
                this.totalItems = totalItems;
                this.items = items;

                items.forEach((element) => {
                    var courseName = element.course.name;
                    var provider   = element.course.provider.name;

                    this.courses.push({
                        courseName: courseName,
                        provider: provider
                    });
                });
            });
        },

        addFeaturedCourses: function () {
            axios.get(APIFEATUREDURL).then((res) => {
                var names      = res.data;

                names.forEach((data) => {
                    var courseName     = data.coursePublication.course.name;
                    var provider       = data.coursePublication.course.provider.name;
                    var featuredBanner = 'https://storage.cebroker.com/CEBroker/'
                                         + data.coursePublication.course.featuredBanner;

                    this.featuredCourses.push({
                        courseName: courseName,
                        provider: provider,
                        featuredBanner: featuredBanner
                    });
                });
            });
        }
    },            
});