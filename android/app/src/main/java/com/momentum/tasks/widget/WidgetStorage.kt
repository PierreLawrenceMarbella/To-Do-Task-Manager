package com.momentum.tasks.widget

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class WidgetTask(
    val id: String,
    val title: String,
    val dueDate: String,
    val dueTime: String,
    val completed: Boolean
)

data class WidgetPayload(val tasks: List<WidgetTask>, val accentColor: String)

object WidgetStorage {
    private const val PREFS = "momentum_widget"
    private const val TASKS = "tasks_json"
    private const val ACCENT = "accent_color"

    fun save(context: Context, tasksJson: String, accentColor: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit()
            .putString(TASKS, tasksJson)
            .putString(ACCENT, accentColor)
            .apply()
    }

    fun load(context: Context): WidgetPayload {
        val preferences = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val tasks = mutableListOf<WidgetTask>()
        val array = try { JSONArray(preferences.getString(TASKS, "[]")) } catch (_: Exception) { JSONArray() }
        for (index in 0 until array.length()) {
            val item = array.optJSONObject(index) ?: JSONObject()
            val id = item.optString("id")
            val title = item.optString("title")
            if (id.isBlank() || title.isBlank()) continue
            tasks += WidgetTask(
                id = id,
                title = title,
                dueDate = item.optString("dueDate"),
                dueTime = item.optString("dueTime"),
                completed = item.optBoolean("completed")
            )
        }
        return WidgetPayload(tasks, preferences.getString(ACCENT, "#6d5dfc") ?: "#6d5dfc")
    }
}
