/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */

pimcore.registerNS("pimcore.layout.portlets.modifiedAssets");
/**
 * @private
 */
pimcore.layout.portlets.modifiedAssets = Class.create(pimcore.layout.portlets.abstract, {

    getType: function () {
        return "pimcore.layout.portlets.modifiedAssets";
    },

    getName: function () {
        return t("modified_assets");
    },

    getIcon: function () {
        return "pimcore_icon_asset";
    },

    getLayout: function (portletId) {

        var store = new Ext.data.Store({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: Routing.generate('pimcore_admin_portal_portletmodifiedassets'),
                reader: {
                    type: 'json',
                    rootProperty: 'assets'
                }
            },
            fields: ['id','path',"type",'date']
        });

        store.load();

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            columns: [
                {text: t('path'), sortable: false, dataIndex: 'path', flex: 1},
                {text: t('date'), width: 150, sortable: false, renderer: function (d) {
                    var date = new Date(d * 1000);
                    return Ext.Date.format(date, pimcore.globalmanager.get('localeDateTime').getDateTimeFormat());
                }, dataIndex: 'date'}
            ],
            stripeRows: true,
            autoExpandColumn: 'path'
        });

        grid.on("rowclick", function(grid, record, tr, rowIndex, e, eOpts ) {
            var data = grid.getStore().getAt(rowIndex);

            pimcore.helpers.openAsset(data.data.id, data.data.type);
        });

        this.layout = Ext.create('Portal.view.Portlet', Object.assign(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [grid]
        }));

        this.layout.portletId = portletId;
        return this.layout;
    }
});
