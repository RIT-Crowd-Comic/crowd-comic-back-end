'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const userID = 'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce';
dotenv.config();

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface) {
        const timestamp = '2024-07-23 09:38:33.841-07';
        const path = `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`;
        const link = process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com` : 'http://localhost:5000/crowd-comic';
        const imageIDs = ['1_9eb775c0-cd4f-4227-9dd8-1af7f9412604', '1_eb071f2a-fe89-43f1-b73b-02175ed77819', '1_d94663cb-1d58-4e5f-bf9c-5eba27862475'];
        const links = [];
        for (let i = 0; i < 3; i++) {
            links.push(link + imageIDs[i]);
        }

        // ensure that changes are rolled back on error. We don't want only some data to be created
        const transaction = await queryInterface.sequelize.transaction();
        try {
            console.log('creating users');

            // create user
            await queryInterface.bulkInsert('users', [
                {
                    id:           userID,
                    display_name: 'Admin',
                    email:        'example@example.com',
                    password:     await bcrypt.hash('Password!', 10),
                    created_at:   timestamp,
                    updated_at:   timestamp
                }
            ], { returning: ['id'], transaction });

            // create panel sets
            console.log('creating panel sets');
            const panelSets = await queryInterface.bulkInsert('panel_sets', [
                {
                    author_id:  userID,
                    name:       'Trunk 1',
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       'Trunk 2',
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       'Trunk 3',
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       null,
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       'Trunk 4',
                    created_at: timestamp,
                    updated_at: timestamp
                },
                {
                    author_id:  userID,
                    name:       'Trunk 5',
                    created_at: timestamp,
                    updated_at: timestamp
                }
            ], { returning: ['id'], transaction });


            const panelSetIds = panelSets.map(ps => ps.id);

            // creating panels
            console.log('creating panels');
            const panels = await queryInterface.bulkInsert('panels', [
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[0],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[0],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[0],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[1],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[1],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[1],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[2],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[2],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[2],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[3],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[3],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[3],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[4],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[4],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[4],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[5],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[5],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[5],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[6],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[6],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[6],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[7],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[7],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[7],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[8],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[8],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[8],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[9],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[9],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[9],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[10],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[10],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[10],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[11],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[11],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[11],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[12],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[12],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[12],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[13],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[13],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[13],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[14],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[14],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[14],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[15],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[15],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[15],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[16],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[16],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[16],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[17],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[17],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[17],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[18],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[18],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[18],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetIds[19],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetIds[19],
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetIds[19],
                    created_at:   timestamp,
                    updated_at:   timestamp
                }
            ], { returning: ['id'], transaction });

            const panelIds = panels.map(p => p.id);

            // create hooks
            console.log('creating hooks');
            await queryInterface.bulkInsert('hooks', [
                {
                    position:          path,
                    current_panel_id:  panelIds[0],
                    next_panel_set_id: panelSetIds[1],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[1],
                    next_panel_set_id: panelSetIds[3],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[2],
                    next_panel_set_id: panelSetIds[2],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[3],
                    next_panel_set_id: panelSetIds[5],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[4],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[4],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[7],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[7],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[8],
                    next_panel_set_id: panelSetIds[4],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[9],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[10],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[11],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[13],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[14],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[14],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[15],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[16],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[17],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[18],
                    next_panel_set_id: panelSetIds[7],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[18],
                    next_panel_set_id: panelSetIds[8],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[20],
                    next_panel_set_id: panelSetIds[9],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[21],
                    next_panel_set_id: panelSetIds[10],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[22],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[23],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[25],
                    next_panel_set_id: panelSetIds[11],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[25],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[26],
                    next_panel_set_id: panelSetIds[12],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[29],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[29],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[29],
                    next_panel_set_id: panelSetIds[13],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[30],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[30],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[31],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[34],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[35],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[35],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[38],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[38],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[38],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[40],
                    next_panel_set_id: panelSetIds[14],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[41],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[41],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[42],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[43],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[44],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[45],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[45],
                    next_panel_set_id: panelSetIds[16],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[47],
                    next_panel_set_id: panelSetIds[17],
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[49],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[49],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[50],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[51],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[53],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[53],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[54],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[54],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[56],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[57],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[57],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panelIds[57],
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                }

            ], { transaction });
            await transaction.commit();

        }

        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Seeder failed after transaction rollback.');
        }
    },

    async down(queryInterface, { Op }) {

        // ensure that changes are rolled back on error. We don't want only some data to be deleted
        const transaction = await queryInterface.sequelize.transaction();
        try {

            // delete panel_set
            await queryInterface.bulkDelete('panel_sets', { id: { [Op.lte]: 20 } }, { transaction });

            // delete panels
            await queryInterface.bulkDelete('panels', { id: { [Op.lte]: 60 } }, { transaction });

            // delete hooks
            await queryInterface.bulkDelete('hooks', { id: { [Op.lte]: 60 } }, { transaction });

            // delete user after all the dependent tables are deleted
            await queryInterface.bulkDelete('users', { id: userID });

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Reverting failed after transaction rollback.');
        }
    }
};
