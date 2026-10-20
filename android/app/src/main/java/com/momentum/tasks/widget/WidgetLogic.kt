package com.momentum.tasks.widget

data class WidgetSummary(
    val total: Int,
    val completed: Int,
    val pending: List<WidgetTask>
) {
    val percentage: Int get() = if (total == 0) 0 else completed * 100 / total
}

fun getWidgetSummary(tasks: List<WidgetTask>, today: String): WidgetSummary {
    val dueToday = tasks.filter { it.dueDate == today }
    return WidgetSummary(
        total = dueToday.size,
        completed = dueToday.count { it.completed },
        pending = dueToday.filterNot { it.completed }
            .sortedWith(compareBy({ it.dueTime.isBlank() }, { it.dueTime }, { it.title.lowercase() }))
    )
}
