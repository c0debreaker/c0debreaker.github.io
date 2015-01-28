'use strict';

// This should only contain keys that you want to calculate
angular.module('Property.Maps', [])
    .constant('RFIDPropertyMap', {
        totalRfidValid : 'odometerRfidValid',
        totalRfidVoid : 'odometerRfidVoid'
    })

    .constant('NonRFIDPropertyMap', {
        totalInchesPrinted : 'odometerInchesPrinted'
    })

    .constant('PrinterModels',
         [
            { 'QLN220' : 'QLn220', subType : '' },
            { 'QLN320' : 'QLn320', subType : '' },
            { 'QL320+' : 'QL320 plus', subType : '' },
            { 'QLN320PLUS' : 'QLN320plus', subType : '' },
            { 'QLN420' : 'QLn420', subType : '' },
            { 'R110XI4' : 'R110Xi4', subType : '' },
            { '110XI4' : '110Xi4', subType : '' },
            { '110XI3' : '110Xi3', subType : '' },
            { '140XI3' : '140Xi3', subType : '' },
            { '140XI4' : '140Xi4', subType : '' },
            { '170XI3' : '170Xi3', subType : '' },
            { '170XI4' : '170Xi4', subType : '' },
            { '220XI4' : '220Xi4', subType : '' },
            { 'GK420D' : 'GK420d', subType : '' },
            { 'GX420D' : 'GX420d', subType : '' },
            { 'GK420T' : 'GK420t', subType : '' },
            { 'GX420T' : 'GX420t', subType : '' },
            { 'GX430T' : 'GX430t', subType : '' },
            { 'LP2824PLUS' : 'LP 2824 Plus', subType : '' },
            { 'HC100'  : 'HC100', subType : '' },
            { 'S4M'    : 'S4M', subType : '' },
            { '150SLPLUS' : '150SLPlus', subType : '' },
            { '150SL' : '150SL', subType : '' },
            { 'ZM400' : 'ZM400', subType : '' },
            { 'ZM600' : 'ZM600', subType : '' },
            { 'ZT220' : 'ZT220', subType : '' },
            { 'ZT230' : 'ZT230', subType : '' },
            { 'ZQ510' : 'ZQ510', subType : '' },
            { 'ZD500R' : 'ZD500R', subType : '' },
            { 'RZ400'  : 'RZ400',  subType : '' },
            { 'RZ600'  : 'RZ600',  subType : '' },
            { 'ZT410'  : 'ZT410',  subType : '' },
            { 'ZT410R'  : 'ZT410R',  subType : '' },
            { 'ZT420'  : 'ZT420',  subType : '' },
            { 'ZT420R'  : 'ZT420R',  subType : '' },
            { 'NULL'  : 'NULL',  subType : '' }

        ]
    );
