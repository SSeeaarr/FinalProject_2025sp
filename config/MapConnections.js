export const mapConnections = {
   // Forest Map
    "0": {
        rArrow: [
            {
                x: 37,
                y: 14,
                destinationMap: "1",
                destinationX: 3,
                destinationY: 14
            }
        ]
    },
    "1": {
        lArrow: [
            {
                x: 2,
                y: 14,
                destinationMap: "0",
                destinationX: 36,
                destinationY: 14
            },
        ],
        dArrow: [
            {
                x: 36,
                y: 20,
                destinationMap: "2",
                destinationX: 36,
                destinationY: 3
            },
            
        ]
    },
    
    "2": {
        uArrow: [
            {
                x: 36,
                y: 2,
                destinationMap: "1",
                destinationX: 36,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 36,
                y: 20,
                destinationMap: "3",
                destinationX: 36,
                destinationY: 3
            },

        ],
        rArrow: [
            {
                x: 36,
                y: 14,
                destinationMap: "33",
                destinationX: 3,
                destinationY: 13
            }
        ]
    },
    "3": {
        uArrow: [
            {
                x: 36,
                y: 2,
                destinationMap: "2",
                destinationX: 36,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 4,
                y: 20,
                destinationMap: "4",
                destinationX: 3,
                destinationY: 3
            },
            
        ]
    },
    "4": {
        uArrow: [
            {
                x: 3,
                y: 2,
                destinationMap: "3",
                destinationX: 4,
                destinationY: 19
            }],
            dArrow:[
            {
                x: 22,
                y: 20,
                destinationMap: "5",
                destinationX: 22,
                destinationY: 3
            },
        ]
    },
    "5": { // intersection between left snow, right desert, downward beach, upwards back to village
        uArrow: [
            {
                x: 22,
                y: 2,
                destinationMap: "4",
                destinationX: 22,
                destinationY: 19
            }
        ],
        rArrow: [
            {
                x: 37,
                y: 15,
                destinationMap: "6",
                destinationX: 3,
                destinationY: 15
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 13,
                destinationMap: "7",
                destinationX: 36,
                destinationY: 13
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "8",
                destinationX: 20,
                destinationY: 3
            }
        ]
    },
    "6": {
        rArrow: [
            {
                x: 36,
                y: 15,
                destinationMap: "22",
                destinationX: 2,
                destinationY: 16
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 15,
                destinationMap: "5",
                destinationX: 36,
                destinationY: 15
            }
        ],
    },
    "7": {
        rArrow: [
            {
                x: 37,
                y: 13,
                destinationMap: "5",
                destinationX: 3,
                destinationY: 13
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "9",
                destinationX: 36,
                destinationY: 12
            }
        ],
    },
    "8": { // Leads to beach come back later - To me Nick
        uArrow: [
            {
                x: 22,
                y: 3,
                destinationMap: "5",
                destinationX: 22,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 18,
                destinationMap: "28",
                destinationX: 20,
                destinationY: 2
            }
        ]
    },
    "9": {
        rArrow: [
            {
                x: 37,
                y: 12,
                destinationMap: "7",
                destinationX: 3,
                destinationY: 12
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "10",
                destinationX: 36,
                destinationY: 12
            }
        ]
    },
    "10": {
        rArrow: [
            {
                x: 37,
                y: 12,
                destinationMap: "9",
                destinationX: 3,
                destinationY: 12
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "11",
                destinationX: 36,
                destinationY: 12
            }
        ]
    },
    "11": {
        rArrow: [
            {
                x: 37,
                y: 12,
                destinationMap: "10",
                destinationX: 3,
                destinationY: 12
            }
        ],
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "12",
                destinationX: 20,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "16",
                destinationX: 20,
                destinationY: 3
            }
        ]
    },
    "12": {
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "13",
                destinationX: 20,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "11",
                destinationX: 20,
                destinationY: 3
            }
        ]
    },
    "13": {
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "14",
                destinationX: 20,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "12",
                destinationX: 20,
                destinationY: 3
            }
        ]
    },
    "14": {
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "13",
                destinationX: 20,
                destinationY: 3
            }
        ],
        rArrow: [
            {
                x: 37,
                y: 12,
                destinationMap: "15",
                destinationX: 3,
                destinationY: 12
            }
        ],
    },
    "15": {
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "14",
                destinationX: 36,
                destinationY: 12
            }
        ],
    },
    "16": {
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "11",
                destinationX: 20,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 20,
                y: 20,
                destinationMap: "17",
                destinationX: 20,
                destinationY: 3
            }
        ]
    },
    "17": {
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "16",
                destinationX: 20,
                destinationY: 19
            }
        ],
        rArrow: [
            {
                x: 37,
                y: 12,
                destinationMap: "18",
                destinationX: 3,
                destinationY: 12
            }
        ]
    },
    "18": {
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "17",
                destinationX: 36,
                destinationY: 12
            }
        ],
    },
    "19": {
        uArrow: [
            {
                x: 18,
                y: 2,
                destinationMap: "20",
                destinationX: 18,
                destinationY: 19
            },
            {
                x: 19,
                y: 2,
                destinationMap: "20",
                destinationX: 19,
                destinationY: 19
            }
        ],
        dArrow: [
            {
                x: 18,
                y: 20,
                destinationMap: "33",
                destinationX: 20,
                destinationY: 4
            },
            {
                x: 19,
                y: 20,
                destinationMap: "33",
                destinationX: 20,
                destinationY: 4
            }
        ]
    },
    "20": {
        dArrow: [
            {
                x: 18,
                y: 21,
                destinationMap: "19",
                destinationX: 18,
                destinationY: 3
            },
            {
                x: 19,
                y: 21,
                destinationMap: "19",
                destinationX: 19,
                destinationY: 3
            }
        ],
        uArrow: [
            {
                x: 18,
                y: 1,
                destinationMap: "21",
                destinationX: 18,
                destinationY: 19
            },
            {
                x: 19,
                y: 1,
                destinationMap: "21",
                destinationX: 19,
                destinationY: 19
            }
        ]
    },
    "22": {
        rArrow: [
            {
                x: 36,
                y: 15,
                destinationMap: "23",
                destinationX: 2,
                destinationY: 16
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "6",
                destinationX: 38,
                destinationY: 20
            }
        ],
    },
    "23": {
        uArrow: [
            {
                x: 3,
                y: 2,
                destinationMap: "24",
                destinationX: 3,
                destinationY: 21
            }
        ],
        rArrow: [
            {
                x: 36,
                y: 15,
                destinationMap: "25",
                destinationX: 2,
                destinationY: 16
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "22",
                destinationX: 38,
                destinationY: 20
            }
        ],
        dArrow:[
            {
                x: 22,
                y: 20,
                destinationMap: "26",
                destinationX: 3,
                destinationY: 3
            },
        ]
    },
    "24": {
        rArrow: [
            {
                x: 36,
                y: 15,
                destinationMap: "27",
                destinationX: 2,
                destinationY: 16
            }
        ],
        dArrow:[
            {
                x: 22,
                y: 20,
                destinationMap: "23",
                destinationX: 3,
                destinationY: 3
            },
        ]
    },
    "25": {
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "23",
                destinationX: 38,
                destinationY: 20
            }
        ],
    },
    "26": {
        uArrow: [
            {
                x: 3,
                y: 2,
                destinationMap: "23",
                destinationX: 3,
                destinationY: 21
            }
        ],
    },
    "27": {
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "24",
                destinationX: 38,
                destinationY: 20
            }
        ],
    },
    "28": {
        uArrow: [
            {
                x: 10,
                y: 2,
                destinationMap: "8",
                destinationX: 36,
                destinationY: 10
            }],
            dArrow:[
            {
                x: 22,
                y: 20,
                destinationMap: "29",
                destinationX: 10,
                destinationY: 5
            },
        ]
    },
    "29": {
        uArrow: [
            {
                x: 10,
                y: 3,
                destinationMap: "28",
                destinationX: 22,
                destinationY: 19
            }],
            dArrow:[
            {
                x: 22,
                y: 20,
                destinationMap: "30",
                destinationX: 10,
                destinationY: 4
            },
        ],
        rArrow: [
            {
                x: 36,
                y: 15,
                destinationMap: "31",
                destinationX: 5,
                destinationY: 5
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 12,
                destinationMap: "32",
                destinationX: 30,
                destinationY: 15
            }
        ],
    },
    "30": {
        uArrow: [
            {
                x: 10,
                y: 2,
                destinationMap: "29",
                destinationX: 22,
                destinationY: 18
            }]
            
    },
    "31": {
        lArrow: [
            {
                x: 3,
                y: 5,
                destinationMap: "29",
                destinationX: 34,
                destinationY: 15
            }]
            
    },
    "32": {
        rArrow: [
            {
                x: 34,
                y: 15,
                destinationMap: "29",
                destinationX: 4,
                destinationY: 12
            }]
    },
    "33": {
        uArrow: [
            {
                x: 20,
                y: 2,
                destinationMap: "19",
                destinationX: 19,
                destinationY: 19
            }
        ],
        lArrow: [
            {
                x: 2,
                y: 13,
                destinationMap: "2",
                destinationX: 35,
                destinationY: 14
            }
        ],
    },

};


export default mapConnections;