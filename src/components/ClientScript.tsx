import type { FC } from 'hono/jsx'

export const ClientScript: FC = () => {
  return (
    <script dangerouslySetInnerHTML={{
      __html: `
    const yearSelect = document.getElementById('year-select');
    const toast = document.getElementById('toast');
    const prevYear = document.getElementById('prev-year');
    const nextYear = document.getElementById('next-year');

    function navigateToYear(year) {
      window.location.href = '/' + year;
    }

    yearSelect.addEventListener('change', (e) => {
      navigateToYear(e.target.value);
    });

    prevYear.addEventListener('click', () => {
      const current = parseInt(yearSelect.value);
      if (current > 1900) navigateToYear(current - 1);
    });

    nextYear.addEventListener('click', () => {
      const current = parseInt(yearSelect.value);
      if (current < 2100) navigateToYear(current + 1);
    });

    function copyToClipboard(text, element) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      element.classList.add('!bg-green-100', '!text-green-700', '!rounded');
      toast.textContent = 'Copied: ' + text;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        element.classList.remove('!bg-green-100', '!text-green-700', '!rounded');
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, 1000);
    }

    document.querySelectorAll('.day-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(cell.dataset.date, cell);
      });
    });

    document.querySelectorAll('.epiweek-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(cell.dataset.epiweek, cell);
      });
    });

    // Highlight today's date using client-side timezone
    function highlightToday() {
      // Remove previous highlights
      document.querySelectorAll('.day-cell').forEach(function(cell) {
        cell.classList.remove('bg-sky-200', 'font-semibold', 'hover:bg-sky-300');
      });

      // Add highlight to today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = year + '-' + month + '-' + day;

      const todayCells = document.querySelectorAll('.day-cell[data-date="' + todayStr + '"]');
      todayCells.forEach(function(cell) {
        cell.classList.add('bg-sky-200', 'font-semibold', 'hover:bg-sky-300');
      });
    }

    highlightToday();
      `
    }} />
  )
}
