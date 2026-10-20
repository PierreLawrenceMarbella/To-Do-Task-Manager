package com.momentum.tasks.widget

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import androidx.glance.appwidget.updateAll
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@CapacitorPlugin(name = "WidgetBridge")
class WidgetBridgePlugin : Plugin() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    @PluginMethod
    fun syncTasks(call: PluginCall) {
        val tasks = call.getArray("tasks")
        if (tasks == null) {
            call.reject("tasks must be an array")
            return
        }
        WidgetStorage.save(context, tasks.toString(), call.getString("accentColor", "#6d5dfc") ?: "#6d5dfc")
        scope.launch {
            try {
                MomentumWidget().updateAll(context)
                call.resolve(JSObject().put("stored", tasks.length()))
            } catch (error: Exception) {
                call.reject("Unable to refresh widget", error)
            }
        }
    }

    @PluginMethod
    fun openAppSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:${context.packageName}")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        call.resolve()
    }
}
