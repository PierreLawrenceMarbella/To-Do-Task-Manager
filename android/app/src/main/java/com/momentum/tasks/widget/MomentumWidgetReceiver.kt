package com.momentum.tasks.widget

import androidx.glance.appwidget.GlanceAppWidgetReceiver

class MomentumWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget = MomentumWidget()
}
