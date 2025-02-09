export const getPriorityStyles = (priority: string): { bg: string; border: string; text: string } => {
    switch(priority.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          border: 'border-red-300',
          text: 'text-red-800'
        };
      case 'high':
        return {
          bg: 'bg-orange-100',
          border: 'border-orange-300',
          text: 'text-orange-800'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-300',
          text: 'text-yellow-800'
        };
      case 'low':
        return {
          bg: 'bg-green-100',
          border: 'border-green-300',
          text: 'text-green-800'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-800'
        };
    }
  };