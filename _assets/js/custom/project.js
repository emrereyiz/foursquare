const siteObject = {
    request: {
        apiURL: "https://api.foursquare.com/v2/venues/",
        clientID: "XI3TMN4TKLCEAPJYICAV3K1JJP0M41JP1ML5WOC40CYLVJU5",
        clientSecret: "4NFTT4EMEK0O3VKJOBIBX5ANSVUCFT2NHYGSMTSCNOSKJARA",
        latitude: "41.0820188",
        longtude: "28.912091999999998",
        date: "20171203",
        city: 'Valletta',
        query: null,
        method: {
            categories: 'categories',
            detail: 'explore'
        },
        // layout Draw
        run: function(url, detail) {
            var drawContent = {
                // draw Sidebar
                drawLeft: function(data) {
                    var response = data.response;
                    var categories = response.categories;
                    var mainCategories = [];

                    $("#sidebar").append("<ul class='navbar navbar-light bg-faded'></ul>");

                    $.each(categories, function(index, categorie) {
                        var id = categorie.id;
                        var name = categorie.name;
                        var icon = categorie.icon.prefix + "bg_32" + categorie.icon.suffix;
                        var subCategorie = categorie.categories;

                        mainCategories.push({
                            id: id,
                            name: name,
                            icon: icon,
                            subCategorie: categorie.categories
                        });

                        $("#sidebar > ul").append("<li data-id='" + id + "' class='navbar-brand'><a href='#'><img src='" + icon + "' alt='"+name+"' />" + name + "</a></li>");
                        $("#sidebar ul li[data-id='" + id + "']").append("<ul></ul>");

                        if (subCategorie.length > 0) {
                            $.each(subCategorie, function(index, subCategorie) {
                                var subId = subCategorie.id;
                                var subName = subCategorie.name;
                                var subIcon = subCategorie.icon.prefix + "64" + subCategorie.icon.suffix;
                                $("#sidebar ul li[data-id='" + id + "'] > ul").append("<li data-id='" + subId + "'><a href='#'>" + subName + "</a></li>");
                            });
                        }
                    });

                    chartSeries = [];
                    $.each(mainCategories, function(index, data) {
                        name = data.name;
                        number = data.subCategorie.length;
                        chartSeries.push({
                            name: name,
                            y: number
                        })
                    });
                    siteObject.chartFunc.reDraw(chartSeries, 'Alt Kategori Sayısı', 'Kategori ve Alt kategori Detayı');

                },
                // get categories detail and draw right layout
                drawRight: function(data) {
                    // set sideObject query
                    siteObject.request.query = $.trim($(".active").html());
                    data = data.response.groups[0].items;

                    // each and get detail
                    layoutTemp = function(item) {
                        var venue = item.venue,
                            name = venue.name,
                            phone = venue.contact.formattedPhone,
                            address = venue.location.address,
                            mapLat = venue.location.lat,
                            mapLng = venue.location.lng,
                            icon = venue.categories[0].icon.prefix + "bg_32" + venue.categories[0].icon.suffix,
                            rating = venue.rating,
                            ratingColor = "#" + venue.ratingColor,
                            totalCheckin = venue.stats.checkinsCount,
                            webSite = venue.url != undefined ? venue.url : "",
                            control = function(data) {
                                return data == undefined ? "" : data;
                            },
                            // repeat item template
                            temp = '<div class="col">' +
                            '<div class="card">' +
                            '<div class="card-block">' +
                            '<h4 class="card-title">' + name + '</h4>' +
                            //'<img src="'+icon+'">' +
                            '<p class="card-text">' +
                            '<strong>Telefon: </strong><small>' + phone + '</small><br />' +
                            '<strong>Adres: </strong><small>' + address + '</small><br />' +
                            '<strong>Toplam Check-in: </strong><small>' + totalCheckin + '</small><br />' +
                            '<strong>Website: </strong><a href="' + webSite + '" target="_blank">' + webSite + '</a><br />' +
                            '<strong>Puan: </strong><small>' + rating + '</small><br />' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        return temp;
                    };

                    chartSeries = [];
                    mapData = [];

                    $("#right-content").html("");
                    // each for map and chart
                    $.each(data, function(index, item) {
                        $("#right-content").append(layoutTemp(item));
                        var name = item.venue.name,
                            rating = item.venue.stats.checkinsCount,
                            mapLat = item.venue.location.lat,
                            mapLng = item.venue.location.lng;

                        if (rating != undefined) {
                            chartSeries.push({
                                name: name,
                                y: rating
                            })
                        }
                        mapData.push({
                            name: name,
                            lat: mapLat,
                            lng: mapLng
                        })
                    });
                    initMap(mapData);
                    siteObject.chartFunc.reDraw(chartSeries, 'Toplam Checkin', 'Toplam Checkin');
                    // hidden undefined element
                    var undefinedEl = $("small:contains('undefined'), a:contains('undefined')");
                    undefinedEl.hide();
                    undefinedEl.prev().hide();


                    if (data.length == 0) {
                        $("#chart, #map").html("");
                        alert("Bu kategoriye ait içerik bulunmamaktadır");
                    }

                },
                // right or left condition 
                returnDraw: function(data) {
                    if (detail == "sidebar") {
                        drawContent.drawLeft(data)
                    } else if (detail == "detail") {
                        drawContent.drawRight(data)
                    };
                }
            };
            // ajax get request
            $.ajax({
                type: "GET",
                url: url,
                success: function(data, status, state) {
                    drawContent.returnDraw(data);
                },
            }).always(function() {
                console.log("sorgu tamamlandı.")
            });
        },
        // return categories URL
        categoriesURL: function() {
            var returnObj = this.apiURL + this.method.categories + "?ll=" + this.latitude + "," + this.longtude + "&client_id=" + this.clientID + "&client_secret=" + this.clientSecret + "&v=" + this.date;
            return returnObj;
        },
        // return detail URL
        detailURL: function() {
            var returnObj = this.apiURL + this.method.detail + "?near=" + this.city + "&query=" + this.query + "&ll=" + this.latitude + "," + this.longtude + "&client_id=" + this.clientID + "&client_secret=" + this.clientSecret + "&v=" + this.date;
            return returnObj;
        },
    },
    // sidebar show and get request function
    sideBar: function() {
        $(document).on('click', '#sidebar li a', function(e) {
            e.preventDefault();
            var query = $.trim($(this).text());
            $(this).parent().find("ul").length != 0 ? $("#sidebar .active").removeClass("active") : "";
            $(this).parent().addClass("active");
            siteObject.request.query = query;

            // get request for categories detail
            siteObject.request.run(siteObject.request.detailURL(), "detail");
        });
    },
    // chart detail (default options and redraw function)
    chartFunc: {
        // chart default option
        chartOptions: function() {
            var options = {
                chart: {
                    renderTo: 'chart',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    height: 400
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: '',
                    colorByPoint: true,
                }]
            };
            return options
        },
        // chart draw function
        reDraw: function(data, label, title) {
            var defaultOptions = this.chartOptions();

            defaultOptions.series[0].name = label;
            defaultOptions.series[0].data = data;
            defaultOptions.title.text = title;

            return new Highcharts.Chart(defaultOptions);
            chart.redraw();
        }
    },
    // basic query control
    ajaxQuery: function(statusType) {
        statusType = statusType || false;
        if (!statusType) {
            alert("Lütfen sorgu tipini boş geçmeyiniz.")
        } else {
            this.request.run(this.request.categoriesURL(), "sidebar");
            this.sideBar();
        }
    },
    // get user city or run static
    promptControl: function() {
        var city = prompt("Lütfen şehir giriniz, şehir girmediğiniz taktirde varsayılan olarak Valletta seçilecektir");
        if (city) {
            $("header span").text(city);
            this.request.city = city;
        } else {
            $("header span").text("Valletta")
        }

    },
    init: function() {
        this.ajaxQuery(true);
    },
}



$(document).ready(function() {
    siteObject.init();
    siteObject.promptControl();
});
