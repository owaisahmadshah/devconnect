import { getDateRange, getDuration } from '@/lib/dateUtils';
import { MdEdit, MdLocationOn, MdCalendarToday } from 'react-icons/md';
import { type TExperienceWithId } from 'shared';

interface ExperienceItemProps extends Partial<TExperienceWithId> {
  isCurrentUser: boolean;
}

export const ExperienceItem = ({
  type,
  description,
  role,
  technologies,
  companyOrProject,
  location,
  started,
  ended,
  isCurrentUser,
}: ExperienceItemProps) => {
  return (
    <div className="flex w-full justify-between">
      <div className="grid flex-1 gap-3">
        {/* Main experience info */}
        <div>
          <h1 className="text-lg font-semibold">{role}</h1>
          <p className="text-base font-medium">{companyOrProject}</p>
          {type && <p className="text-sm capitalize">{type}</p>}
        </div>

        {/* Date and location info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MdCalendarToday size={16} />
            <span>{getDateRange(started!, ended!)}</span>
            {getDuration(started!, ended!) && <span>· {getDuration(started!, ended!)}</span>}
          </div>

          {location && (
            <div className="flex items-center gap-1">
              <MdLocationOn size={16} />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="text-sm">
            <p>{description}</p>
          </div>
        )}

        {/* Technologies/Skills */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Skills:</span>
            {technologies.map((tech, index) => (
              <span key={index} className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Edit button for current user */}
      {isCurrentUser && (
        <div className="ml-4 flex-shrink-0">
          <span className="hover: cursor-pointer transition-colors">
            <MdEdit size={20} />
          </span>
        </div>
      )}
    </div>
  );
};
