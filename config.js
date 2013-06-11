var _ = require('underscore'),
    config


config = {
    path: {
        storage: __dirname + '/storage',
    },
    url: {
        root: 'http://127.0.0.1:8500',
    },
    port: 8500,
    profiles: {
        defaults: {
            formats: ['jpeg', 'png', 'gif'],
            jpegquality: 90,
            pnglevel: -1,
        },
        raw: {
            dir: 'RA',
        },
        flat: {
            dir: 'FL',
            watermark: __dirname + '/wm.png',
        },
        avatar: {
            dir:        'AV',
            width:      300,
            height:     300,
            min_width:  100,
            min_height: 100,
        },
    },
    thumb: {
        jpegquality: 85,
        pnglevel: -1,
    },
}


_.each(config.profiles, function (profile) {
    _.defaults(profile, config.profiles.defaults)
})
delete config.profiles.defaults

module.exports = config
